import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle, LoaderCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

type Detection = {
  label: string;
  confidence: number;
  box: { x: number; y: number; width: number; height: number };
};

const YOLO_CONF = 0.05; // very low = show (almost) everything YOLO finds
const maxFileBytes = 10 * 1024 * 1024;
const colors = ["#f59e0b", "#22c55e", "#3b82f6", "#ef4444", "#a855f7", "#14b8a6", "#ec4899", "#eab308"];
const toPercent = (c: number) => Math.round(Math.min(100, Math.max(0, c <= 1 ? c * 100 : c)));

export const Route = createFileRoute("/yolo")({ component: YoloPage });

function YoloPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return setPreviewUrl(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const detect = useMutation({
    mutationFn: async (f: File): Promise<Detection[]> => {
      const baseUrl = (import.meta.env["VITE_API_BASE_URL"] || "http://localhost:8000").replace(/\/+$/, "");
      const body = new FormData();
      body.append("file", f);
      let res: Response;
      try {
        res = await fetch(`${baseUrl}/detect?conf=${YOLO_CONF}`, { method: "POST", body });
      } catch {
        throw new Error("Could not connect to the server. Is the backend running?");
      }
      if (!res.ok) throw new Error(`Detection failed (error ${res.status}).`);
      const data = await res.json();
      return Array.isArray(data?.detections) ? data.detections : [];
    },
  });

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.currentTarget.files?.[0];
    e.currentTarget.value = "";
    detect.reset();
    if (!f) return;
    if (!/\.(png|jpe?g)$/i.test(f.name)) return setError("Choose a PNG, JPG, or JPEG image.");
    if (f.size > maxFileBytes) return setError("Image is larger than 10 MB.");
    setError(null);
    setFile(f);
  };

  const detections = detect.data ?? [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-medium">YOLO detections (all boxes)</h1>
          <Link to="/" className="font-mono text-xs uppercase tracking-widest text-primary">
            ← Classifier
          </Link>
        </div>
        <p className="mt-2 text-sm text-foreground/60">
          Raw YOLO output at confidence ≥ {YOLO_CONF}. Low-confidence boxes are often wrong.
        </p>

        <input ref={inputRef} type="file" accept=".png,.jpg,.jpeg,image/png,image/jpeg" onChange={onChange} className="sr-only" />
        <div className="mt-6 flex gap-3">
          <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
            <Upload aria-hidden="true" /> {file ? "Change photo" : "Choose photo"}
          </Button>
          <Button type="button" disabled={!file || detect.isPending} onClick={() => file && detect.mutate(file)}>
            {detect.isPending && <LoaderCircle aria-hidden="true" className="animate-spin" />}
            {detect.isPending ? "Detecting…" : "Run YOLO"}
          </Button>
        </div>

        {(error || detect.isError) && (
          <p role="alert" className="mt-4 flex items-center gap-2 text-sm text-destructive">
            <AlertCircle aria-hidden="true" className="size-4" />
            {error ?? detect.error?.message}
          </p>
        )}

        {previewUrl && (
          <div className="relative mt-6 overflow-hidden rounded-lg bg-foreground/10">
            <img src={previewUrl} alt="Uploaded leaf" className="block h-auto w-full" />
            {detections.map((d, i) => (
              <div
                key={i}
                className="absolute border-2"
                style={{
                  borderColor: colors[i % colors.length],
                  left: `${d.box.x * 100}%`,
                  top: `${d.box.y * 100}%`,
                  width: `${d.box.width * 100}%`,
                  height: `${d.box.height * 100}%`,
                }}
              >
                <span
                  className="absolute left-0 top-0 max-w-full -translate-y-full truncate px-1 font-mono text-[10px] leading-4 text-black"
                  style={{ backgroundColor: colors[i % colors.length] }}
                >
                  {i + 1} {d.label} {toPercent(d.confidence)}%
                </span>
              </div>
            ))}
          </div>
        )}

        {detect.isSuccess && (
          <div className="mt-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/55">
              {detections.length} detection{detections.length === 1 ? "" : "s"}
            </p>
            {detections.length === 0 ? (
              <p className="mt-2 text-sm text-foreground/70">
                YOLO found nothing at this threshold. That does not mean the leaf is healthy.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {detections.map((d, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <span className="size-3 rounded-sm" style={{ backgroundColor: colors[i % colors.length] }} />
                    <span className="font-mono text-xs text-foreground/50">{i + 1}</span>
                    <span className="flex-1">{d.label}</span>
                    <span className="font-mono text-xs">{toPercent(d.confidence)}%</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>
    </div>
  );
}