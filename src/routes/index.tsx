import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
} from "react";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  CircleCheck,
  LoaderCircle,
  RotateCcw,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  languages,
  ui,
  diseaseNames,
  diseaseInfoByLang,
  fruitDiseaseNames,
  fruitDiseaseInfoByLang,
  type Lang,
  type Mode,
} from "@/i18n";

type Prediction = {
  predicted_class: string;
  confidence: number;
  all_predictions?: Array<{ label: string; confidence: number }>;
};

type Detection = {
  label: string;
  confidence: number;
  box: { x: number; y: number; width: number; height: number };
};
type AnalysisResult = { prediction: Prediction; detections: Detection[] };

const acceptedExtensions = /\.(png|jpe?g)$/i;
const maxFileBytes = 10 * 1024 * 1024;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mango Disease Detector — Field diagnosis" },
      {
        name: "description",
        content:
          "Upload a mango leaf or fruit photo for an AI-assisted disease estimate and practical next steps.",
      },
      { property: "og:title", content: "Mango Disease Detector" },
      {
        property: "og:description",
        content: "A clear field reading for your mango leaf or fruit, with practical recommendations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/mango-svgrepo-com.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=Noto+Sans+Devanagari:wght@400;500;600&display=swap",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [lang, setLang] = useState<Lang>("en");
  const [mode, setMode] = useState<Mode>("leaf");
  const t = ui[lang];

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang");
      if (saved === "hi" || saved === "mr" || saved === "en") setLang(saved);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("lang", lang);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = lang;
  }, [lang]);

  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const analysis = useMutation({
    mutationFn: async ({ file, mode }: { file: File; mode: Mode }): Promise<AnalysisResult> => {
      const baseUrl = (import.meta.env["VITE_API_BASE_URL"] || "http://localhost:8000").replace(
        /\/+$/,
        "",
      );
      const post = (path: string) => {
        const body = new FormData();
        body.append("file", file);
        return fetch(`${baseUrl}${path}`, { method: "POST", body });
      };

      if (mode === "leaf") {
        const [predictRes, detectRes] = await Promise.allSettled([post("/predict"), post("/detect")]);

        if (predictRes.status === "rejected") {
          throw new Error(t.connectError);
        }
        if (!predictRes.value.ok) {
          throw new Error(t.serverError(predictRes.value.status));
        }
        let result: unknown;
        try {
          result = await predictRes.value.json();
        } catch {
          throw new Error(t.unreadable);
        }
        if (
          typeof result !== "object" ||
          result === null ||
          typeof (result as Record<string, unknown>)["predicted_class"] !== "string" ||
          typeof (result as Record<string, unknown>)["confidence"] !== "number"
        ) {
          throw new Error(t.unexpected);
        }

        let detections: Detection[] = [];
        if (detectRes.status === "fulfilled" && detectRes.value.ok) {
          try {
            const d = await detectRes.value.json();
            if (Array.isArray(d?.detections)) detections = d.detections;
          } catch {
            /* boxes are optional */
          }
        }
        return { prediction: result as Prediction, detections };
      }

      // fruit: single endpoint, derive a "Prediction"-shaped object from top detection
      let res: Response;
      try {
        res = await post("/detect-fruit");
      } catch {
        throw new Error(t.connectError);
      }
      if (!res.ok) throw new Error(t.serverError(res.status));

      let data: unknown;
      try {
        data = await res.json();
      } catch {
        throw new Error(t.unreadable);
      }

      const detections: Detection[] = Array.isArray((data as Record<string, unknown>)?.["detections"])
        ? ((data as Record<string, unknown>)["detections"] as Detection[])
        : [];
      const top = detections[0];
      const prediction: Prediction = top
        ? { predicted_class: top.label, confidence: top.confidence }
        : { predicted_class: "Healthy", confidence: 1 };

      return { prediction, detections };
    },
  });

  const acceptFile = (file?: File) => {
    analysis.reset();
    if (!file) return;
    if (
      !acceptedExtensions.test(file.name) ||
      (file.type && !["image/png", "image/jpeg"].includes(file.type))
    ) {
      setSelectedFile(null);
      setFileError(t.invalidType);
      return;
    }
    if (file.size > maxFileBytes) {
      setSelectedFile(null);
      setFileError(t.tooLarge);
      return;
    }
    setFileError(null);
    setSelectedFile(file);
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    acceptFile(event.currentTarget.files?.[0]);
    event.currentTarget.value = "";
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    acceptFile(event.dataTransfer.files[0]);
  };

  const onDropKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      inputRef.current?.click();
    }
  };

  const normalizeKey = (s: string) => {
    const k = s.trim().toLowerCase().replace(/-/g, " ").replace(/\s+/g, " ");
    return k === "die black" ? "die back" : k;
  };

  // mode-aware lookup tables
  const diseaseNamesMap = mode === "leaf" ? diseaseNames : fruitDiseaseNames;
  const diseaseInfoMap = mode === "leaf" ? diseaseInfoByLang : fruitDiseaseInfoByLang;

  const prediction = analysis.data?.prediction;
  const detections = analysis.data?.detections ?? [];
  const className = prediction?.predicted_class.trim() ?? "";
  const diseaseKey = normalizeKey(className);
  const disease = diseaseInfoMap[lang][diseaseKey];
  const isHealthy = diseaseKey === "healthy";
  const toPercent = (c: number) => Math.round(Math.min(100, Math.max(0, c <= 1 ? c * 100 : c)));
  const percent = prediction ? toPercent(prediction.confidence) : 0;
  const nameOf = (label: string) => diseaseNamesMap[lang][normalizeKey(label)] ?? label;
  const displayName = diseaseNamesMap[lang][diseaseKey] ?? className;
  const topDetection = isHealthy
    ? undefined
    : detections.find((d) => normalizeKey(d.label) === diseaseKey);
  const otherPredictions = (prediction?.all_predictions ?? [])
    .filter((p) => normalizeKey(p.label) !== diseaseKey)
    .slice(0, 3);

  const reset = () => {
    analysis.reset();
    setSelectedFile(null);
    setFileError(null);
  };

  const switchMode = (m: Mode) => {
    if (m === mode) return;
    setMode(m);
    reset();
  };

  // mode-aware strings
  const heroTitle = mode === "leaf" ? t.heroTitle : t.heroTitleFruit;
  const heroSub = mode === "leaf" ? t.heroSub : t.heroSubFruit;
  const intakeStepLabel = mode === "leaf" ? t.leafIntakeStep : t.fruitIntakeStep;
  const dropTitle = mode === "leaf" ? t.dropTitle : t.dropTitleFruit;
  const analyzeLabel = mode === "leaf" ? t.analyze : t.analyzeFruit;
  const analyzingLabel = mode === "leaf" ? t.analyzing : t.analyzingFruit;
  const readingFeaturesLabel = mode === "leaf" ? t.readingFeatures : t.readingFeaturesFruit;
  const footerLabel = mode === "leaf" ? t.footer : t.footerFruit;
  const appTitleLabel = mode === "leaf" ? t.appTitle : t.appTitleFruit;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-foreground/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <img
              src="/mango-svgrepo-com.svg"
              alt="Mango Disease Detector logo"
              className="size-8 rounded-lg object-contain"
            />
            <div className="leading-none">
              <p className="font-display text-[17px] font-medium">{appTitleLabel}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">
                {t.fieldDiagnostic}
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-6 font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/50 md:flex">
            <span className="text-primary">{t.step1}</span>
            <span>{t.step2}</span>
            <span>{t.step3}</span>
          </div>
          <div className="flex items-center gap-3">
            <div
              role="group"
              aria-label="Mode"
              className="flex overflow-hidden rounded-lg ring-1 ring-foreground/15"
            >
              {(["leaf", "fruit"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => switchMode(m)}
                  aria-pressed={mode === m}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    mode === m ? "bg-primary text-primary-foreground" : "hover:bg-foreground/5"
                  }`}
                >
                  {m === "leaf" ? t.modeLeaf : t.modeFruit}
                </button>
              ))}
            </div>
            <div
              role="group"
              aria-label={t.language}
              className="flex overflow-hidden rounded-lg ring-1 ring-foreground/15"
            >
              {languages.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLang(l.code)}
                  aria-pressed={lang === l.code}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    lang === l.code ? "bg-primary text-primary-foreground" : "hover:bg-foreground/5"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 sm:py-14">
        <div className="max-w-[40ch]">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-citrus">
            {intakeStepLabel}
          </p>
          <h1 className="mt-3 font-display text-3xl font-medium leading-tight text-balance sm:text-[2.6rem]">
            {heroTitle}
          </h1>
          <p className="mt-4 max-w-[52ch] text-base text-foreground/70 text-pretty sm:text-lg">
            {heroSub}
          </p>
        </div>

        <div
          className={`mt-10 grid grid-cols-1 items-stretch gap-4 ${prediction ? "md:grid-cols-3" : "max-w-xl"}`}
        >
          <section className="flex flex-col rounded-xl bg-secondary p-6 ring-1 ring-foreground/5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/55">
                {t.intakeLabel}
              </span>
              <span className="font-mono text-[10px] text-foreground/40">{t.fileHint}</span>
            </div>

            <div
              role="button"
              tabIndex={0}
              aria-label={dropTitle}
              onClick={() => inputRef.current?.click()}
              onKeyDown={onDropKeyDown}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              className={`mt-5 grid min-h-56 cursor-pointer place-items-center rounded-lg border border-dashed p-5 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isDragging ? "border-primary bg-primary/10" : "border-primary/40 bg-background/60 hover:border-primary/70 hover:bg-background/80"}`}
            >
              {previewUrl ? (
                <div className="w-full">
                  <img
                    src={previewUrl}
                    alt={mode === "leaf" ? "Selected mango leaf preview" : "Selected mango fruit preview"}
                    className="mx-auto max-h-48 w-full rounded-md object-contain"
                  />
                  <p className="mt-3 truncate text-sm font-medium text-foreground/80">
                    {selectedFile?.name}
                  </p>
                  <p className="mt-1 text-xs text-foreground/50">{t.replaceHint}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="grid size-11 place-items-center rounded-full bg-primary/10 text-primary">
                    <Upload aria-hidden="true" className="size-5" />
                  </span>
                  <p className="mt-3 text-sm font-medium text-foreground/85">{dropTitle}</p>
                  <p className="mt-1 text-xs text-foreground/50">{t.dropSub}</p>
                </div>
              )}
            </div>

            <input
              ref={inputRef}
              type="file"
              accept=".png,.jpg,.jpeg,image/png,image/jpeg"
              onChange={onFileChange}
              className="sr-only"
              tabIndex={-1}
              aria-label={mode === "leaf" ? "Choose mango leaf photo" : "Choose mango fruit photo"}
            />

            {fileError && (
              <p role="alert" className="mt-4 flex items-center gap-2 text-sm text-destructive">
                <AlertCircle aria-hidden="true" className="size-4 shrink-0" />
                {fileError}
              </p>
            )}
            {analysis.isError && (
              <p role="alert" className="mt-4 flex items-start gap-2 text-sm text-destructive">
                <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                {analysis.error.message}
              </p>
            )}

            <div className="mt-auto pt-6">
              <Button
                type="button"
                onClick={() => selectedFile && analysis.mutate({ file: selectedFile, mode })}
                disabled={!selectedFile || analysis.isPending}
                className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground ring-1 ring-primary/30 transition-colors hover:bg-orange-700"
              >
                {analysis.isPending ? (
                  <LoaderCircle aria-hidden="true" className="animate-spin" />
                ) : (
                  <ArrowRight aria-hidden="true" />
                )}
                {analysis.isPending ? analyzingLabel : analyzeLabel}
              </Button>
              <p className="mt-3 text-center text-[11px] text-foreground/45">
                {analysis.isPending ? readingFeaturesLabel : t.fileHintBottom}
              </p>
            </div>
          </section>

          {prediction && previewUrl && (
            <section
              aria-live="polite"
              className={`diagnosis-reveal flex flex-col rounded-xl p-6 ring-1 ring-foreground/5 ${isHealthy ? "bg-success text-success-foreground" : "bg-primary text-primary-foreground"}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] opacity-70">
                  {t.diagnosisLabel}
                </span>
                {isHealthy ? (
                  <CircleCheck aria-label="Healthy" className="size-4" />
                ) : (
                  <span className="font-mono text-[10px] opacity-55">{t.readingComplete}</span>
                )}
              </div>

              <div className="relative mt-5 overflow-hidden rounded-lg bg-foreground/10">
                <img
                  src={previewUrl}
                  alt={mode === "leaf" ? "Analyzed mango leaf" : "Analyzed mango fruit"}
                  className="block h-auto w-full"
                />
                {topDetection && (
                  <div
                    className="absolute border-2 border-citrus"
                    style={{
                      left: `${topDetection.box.x * 100}%`,
                      top: `${topDetection.box.y * 100}%`,
                      width: `${topDetection.box.width * 100}%`,
                      height: `${topDetection.box.height * 100}%`,
                    }}
                  >
                    <span className="absolute left-0 top-0 max-w-full -translate-y-full truncate bg-citrus px-1 font-mono text-[10px] leading-4 text-foreground">
                      {nameOf(topDetection.label)} {toPercent(topDetection.confidence)}%
                    </span>
                  </div>
                )}
              </div>
              {!isHealthy && !topDetection && (
                <p className="mt-2 text-[11px] opacity-60">{t.noOutline}</p>
              )}

              <div className="mt-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-60">
                  {isHealthy ? t.goodNews : t.detectedCondition}
                </p>
                <h2 className="mt-1 font-display text-2xl font-medium leading-tight text-balance">
                  {displayName || t.unknownResult}
                </h2>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between font-mono text-[11px] opacity-70">
                  <span>{t.confidence}</span>
                  <span className="text-citrus">{percent}%</span>
                </div>
                <div
                  role="progressbar"
                  aria-label="Prediction confidence"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={percent}
                  className="mt-2 h-1.5 overflow-hidden rounded-full bg-primary-foreground/15"
                >
                  <div
                    className="h-full rounded-full bg-citrus transition-[width] duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              <p className="mt-5 text-sm leading-relaxed opacity-85 text-pretty">
                {disease?.description ?? t.noDescription}
              </p>
              {mode === "leaf" && otherPredictions.length > 0 && (
                <div className="mt-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-60">
                    {t.otherPossibilities}
                  </p>
                  <ul className="mt-2 space-y-2">
                    {otherPredictions.map((p) => {
                      const pct = toPercent(p.confidence);
                      return (
                        <li key={p.label}>
                          <div className="flex items-center justify-between font-mono text-[11px] opacity-80">
                            <span>{nameOf(p.label)}</span>
                            <span>{pct}%</span>
                          </div>
                          <div className="mt-1 h-1 overflow-hidden rounded-full bg-primary-foreground/15">
                            <div
                              className="h-full rounded-full bg-citrus"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              <p className="mt-4 border-t border-primary-foreground/15 pt-3 text-[11px] leading-relaxed opacity-60">
                {t.disclaimer}
              </p>
              {isHealthy && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={reset}
                  className="mt-5 w-full rounded-lg border-primary-foreground/30 bg-background py-2.5 text-sm font-medium text-primary shadow-none transition-colors hover:bg-primary-foreground/90"
                >
                  <RotateCcw aria-hidden="true" />
                  {t.tryAnother}
                </Button>
              )}
            </section>
          )}

          {prediction && !isHealthy && previewUrl && (
            <section className="diagnosis-reveal flex flex-col rounded-xl bg-secondary p-6 ring-1 ring-foreground/5 [animation-delay:100ms]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/55">
                  {t.nextSteps}
                </span>
                <span className="font-mono text-[10px] text-foreground/45">
                  {t.remediesCount(disease?.remedies.length ?? 0)}
                </span>
              </div>

              <h2 className="mt-5 font-display text-xl font-medium leading-tight">
                {t.recommendedRemedies}
              </h2>
              {disease && disease.remedies.length > 0 ? (
                <ul className="mt-5 space-y-4">
                  {disease.remedies.map((remedy, index) => (
                    <li key={remedy} className="flex gap-3">
                      <span className="font-mono text-[11px] leading-5 text-citrus">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="text-sm leading-relaxed text-foreground/80 text-pretty">
                        {remedy}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm leading-relaxed text-foreground/70">
                  {t.noRemedyGuide}
                </p>
              )}

              <p className="mt-5 border-t border-foreground/10 pt-4 text-xs leading-relaxed text-foreground/55">
                {t.consultExpert}
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={reset}
                className="mt-auto w-full rounded-lg border-primary/25 bg-background py-2.5 text-sm font-medium text-primary shadow-none transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <RotateCcw aria-hidden="true" />
                {t.tryAnother}
              </Button>
            </section>
          )}
        </div>

        <p className="mt-10 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/40">
          {footerLabel}
        </p>
      </main>
    </div>
  );
}