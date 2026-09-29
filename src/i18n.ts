export type Lang = "en" | "hi" | "mr";
export type DiseaseInfo = { description: string; remedies: string[] };

export const languages: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "mr", label: "मराठी" },
];

const en = {
  language: "Language",
  appTitle: "Mango Leaf Disease Detector",
  fieldDiagnostic: "Field diagnostic",
  step1: "01 Intake",
  step2: "02 Diagnosis",
  step3: "03 Remedies",
  leafIntakeStep: "Leaf intake · Step 01",
  heroTitle: "Read a mango leaf like a field note.",
  heroSub: "Choose a clear photo of a single leaf for an AI-assisted reading and practical next steps.",
  intakeLabel: "01 · Intake",
  fileHint: "JPEG · PNG · 10 MB max",
  dropTitle: "Click to upload or drag and drop a mango leaf photo",
  dropSub: "Choose an image from your device",
  replaceHint: "Click or drop another photo to replace",
  analyze: "Analyze Leaf",
  analyzing: "Analyzing your leaf…",
  readingFeatures: "Reading leaf features",
  fileHintBottom: "JPEG or PNG · up to 10 MB",
  invalidType: "Choose a PNG, JPG, or JPEG image.",
  tooLarge: "This image is larger than 10 MB. Choose a smaller photo.",
  connectError: "Could not connect to the server. Is the backend running?",
  serverError: (s: number) => `The server could not analyze this photo (error ${s}). Please try again.`,
  unreadable: "The server returned an unreadable result. Please try again.",
  unexpected: "The server returned an unexpected result. Please try again.",
  diagnosisLabel: "02 · Diagnosis",
  readingComplete: "Reading complete",
  goodNews: "Good news",
  detectedCondition: "Detected condition",
  confidence: "Confidence",
  unknownResult: "Unknown result",
  noDescription: "The model returned a condition without additional description. Consider confirming the result with an agricultural expert.",
  otherPossibilities: "Other possibilities",
  disclaimer: "This is an AI-assisted estimate, not a substitute for expert diagnosis.",
  tryAnother: "Try another photo",
  nextSteps: "03 · Next steps",
  remediesCount: (n: number) => `${n} remedies`,
  recommendedRemedies: "Recommended Remedies",
  noRemedyGuide: "No specific remedy guide is available for this result. Ask a local agricultural expert for advice.",
  consultExpert: "For severe or recurring infections, consult a local agricultural expert.",
  noOutline: "No area matching this label could be outlined.",
  footer: "Mango leaf field diagnostic · For agricultural guidance",
};
type Ui = typeof en;

const hi: Ui = {
  language: "भाषा",
  appTitle: "आम पत्ती रोग पहचान",
  fieldDiagnostic: "खेत में जाँच",
  step1: "01 अपलोड",
  step2: "02 निदान",
  step3: "03 उपाय",
  leafIntakeStep: "पत्ती अपलोड · चरण 01",
  heroTitle: "आम की पत्ती को खेत की डायरी की तरह पढ़ें।",
  heroSub: "एक पत्ती की साफ़ फ़ोटो चुनें और AI आधारित अनुमान तथा व्यावहारिक अगले कदम पाएँ।",
  intakeLabel: "01 · अपलोड",
  fileHint: "JPEG · PNG · अधिकतम 10 MB",
  dropTitle: "आम की पत्ती की फ़ोटो अपलोड करने के लिए क्लिक करें या खींचकर छोड़ें",
  dropSub: "अपने डिवाइस से फ़ोटो चुनें",
  replaceHint: "बदलने के लिए क्लिक करें या दूसरी फ़ोटो छोड़ें",
  analyze: "पत्ती की जाँच करें",
  analyzing: "पत्ती की जाँच हो रही है…",
  readingFeatures: "पत्ती की विशेषताएँ पढ़ी जा रही हैं",
  fileHintBottom: "JPEG या PNG · 10 MB तक",
  invalidType: "PNG, JPG या JPEG फ़ोटो चुनें।",
  tooLarge: "यह फ़ोटो 10 MB से बड़ी है। छोटी फ़ोटो चुनें।",
  connectError: "सर्वर से कनेक्ट नहीं हो सका। क्या बैकएंड चल रहा है?",
  serverError: (s) => `सर्वर इस फ़ोटो की जाँच नहीं कर सका (त्रुटि ${s})। कृपया दोबारा प्रयास करें।`,
  unreadable: "सर्वर का परिणाम पढ़ा नहीं जा सका। कृपया दोबारा प्रयास करें।",
  unexpected: "सर्वर से अनपेक्षित परिणाम मिला। कृपया दोबारा प्रयास करें।",
  diagnosisLabel: "02 · निदान",
  readingComplete: "जाँच पूरी",
  goodNews: "अच्छी खबर",
  detectedCondition: "पहचानी गई स्थिति",
  confidence: "विश्वसनीयता",
  unknownResult: "अज्ञात परिणाम",
  noDescription: "मॉडल ने इस स्थिति का विवरण नहीं दिया। कृपया किसी कृषि विशेषज्ञ से पुष्टि करें।",
  otherPossibilities: "अन्य संभावनाएँ",
  disclaimer: "यह AI आधारित अनुमान है, विशेषज्ञ निदान का विकल्प नहीं।",
  tryAnother: "दूसरी फ़ोटो आज़माएँ",
  nextSteps: "03 · अगले कदम",
  remediesCount: (n) => `${n} उपाय`,
  recommendedRemedies: "सुझाए गए उपाय",
  noRemedyGuide: "इस परिणाम के लिए कोई विशेष उपाय उपलब्ध नहीं है। स्थानीय कृषि विशेषज्ञ से सलाह लें।",
  consultExpert: "गंभीर या बार-बार होने वाले संक्रमण में स्थानीय कृषि विशेषज्ञ से सलाह लें।",
  noOutline: "इस लेबल से मेल खाता कोई क्षेत्र चिह्नित नहीं हो सका।",
  footer: "आम पत्ती जाँच · कृषि मार्गदर्शन हेतु",
};

const mr: Ui = {
  language: "भाषा",
  appTitle: "आंबा पान रोग ओळख",
  fieldDiagnostic: "शेतातील तपासणी",
  step1: "01 अपलोड",
  step2: "02 निदान",
  step3: "03 उपाय",
  leafIntakeStep: "पान अपलोड · पायरी 01",
  heroTitle: "आंब्याचे पान शेतातील नोंदवहीसारखे वाचा.",
  heroSub: "एका पानाचा स्पष्ट फोटो निवडा आणि AI आधारित अंदाज व व्यावहारिक पुढील उपाय मिळवा.",
  intakeLabel: "01 · अपलोड",
  fileHint: "JPEG · PNG · कमाल 10 MB",
  dropTitle: "आंब्याच्या पानाचा फोटो अपलोड करण्यासाठी क्लिक करा किंवा ड्रॅग करून सोडा",
  dropSub: "तुमच्या डिव्हाइसमधून फोटो निवडा",
  replaceHint: "बदलण्यासाठी क्लिक करा किंवा दुसरा फोटो टाका",
  analyze: "पान तपासा",
  analyzing: "पानाची तपासणी सुरू आहे…",
  readingFeatures: "पानाची वैशिष्ट्ये वाचली जात आहेत",
  fileHintBottom: "JPEG किंवा PNG · 10 MB पर्यंत",
  invalidType: "PNG, JPG किंवा JPEG फोटो निवडा.",
  tooLarge: "हा फोटो 10 MB पेक्षा मोठा आहे. लहान फोटो निवडा.",
  connectError: "सर्व्हरशी कनेक्ट होता आले नाही. बॅकएंड सुरू आहे का?",
  serverError: (s) => `सर्व्हर या फोटोची तपासणी करू शकला नाही (त्रुटी ${s}). कृपया पुन्हा प्रयत्न करा.`,
  unreadable: "सर्व्हरचा निकाल वाचता आला नाही. कृपया पुन्हा प्रयत्न करा.",
  unexpected: "सर्व्हरकडून अनपेक्षित निकाल मिळाला. कृपया पुन्हा प्रयत्न करा.",
  diagnosisLabel: "02 · निदान",
  readingComplete: "तपासणी पूर्ण",
  goodNews: "चांगली बातमी",
  detectedCondition: "ओळखलेली स्थिती",
  confidence: "विश्वासार्हता",
  unknownResult: "अज्ञात निकाल",
  noDescription: "मॉडेलने या स्थितीचे वर्णन दिलेले नाही. कृपया कृषी तज्ज्ञाकडून खात्री करा.",
  otherPossibilities: "इतर शक्यता",
  disclaimer: "हा AI आधारित अंदाज आहे, तज्ज्ञांच्या निदानाला पर्याय नाही.",
  tryAnother: "दुसरा फोटो वापरून पहा",
  nextSteps: "03 · पुढील पावले",
  remediesCount: (n) => `${n} उपाय`,
  recommendedRemedies: "सुचवलेले उपाय",
  noRemedyGuide: "या निकालासाठी विशिष्ट उपाय उपलब्ध नाहीत. स्थानिक कृषी तज्ज्ञाचा सल्ला घ्या.",
  consultExpert: "गंभीर किंवा वारंवार होणाऱ्या प्रादुर्भावासाठी स्थानिक कृषी तज्ज्ञाचा सल्ला घ्या.",
  noOutline: "या लेबलशी जुळणारा भाग चिन्हांकित करता आला नाही.",
  footer: "आंबा पान तपासणी · कृषी मार्गदर्शनासाठी",
};

export const ui: Record<Lang, Ui> = { en, hi, mr };

// Keys match the normalized class names (lowercase, "die back").
export const diseaseNames: Record<Lang, Record<string, string>> = {
  en: {},
  hi: {
    anthracnose: "एन्थ्रेक्नोज",
    "bacterial canker": "जीवाणु कैंकर",
    "cutting weevil": "कटिंग वीविल (पत्ती काटने वाला घुन)",
    "die back": "डाइ बैक (शाखा सूखना)",
    "gall midge": "गॉल मिज (गाँठ बनाने वाली मक्खी)",
    healthy: "स्वस्थ",
    "powdery mildew": "चूर्णिल आसिता (पाउडरी मिल्ड्यू)",
    "sooty mould": "काली फफूँद (सूटी मोल्ड)",
  },
  mr: {
    anthracnose: "अँथ्रॅक्नोज (करपा)",
    "bacterial canker": "जिवाणूजन्य कॅन्कर ",
    "cutting weevil": "पाने कापणारी भुंगेरी (कटिंग वीव्हिल)",
    "die back": "फांद्या वाळणे (डाय बॅक)",
    "gall midge": "गॉल मिज (गाठी करणारी माशी)",
    healthy: "निरोगी",
    "powdery mildew": "भुरी (पावडरी मिल्ड्यू)",
    "sooty mould": "काजळी (सूटी मोल्ड)",
  },
};

export const diseaseInfoByLang: Record<Lang, Record<string, DiseaseInfo>> = {
  en: {
    anthracnose: {
    description:
      "A fungal disease causing dark, sunken spots on leaves, flowers, and fruit, often spreading rapidly in humid conditions.",
    remedies: [
      "Prune and destroy infected leaves and twigs",
      "Apply copper-based fungicide sprays every 10-14 days during humid seasons",
      "Avoid overhead irrigation to reduce leaf wetness",
      "Ensure proper spacing between trees for airflow",
    ],
  },
  "bacterial canker": {
    description:
      "A bacterial infection causing water-soaked lesions and cankers on leaves and stems, which can girdle branches over time.",
    remedies: [
      "Remove and burn severely infected branches",
      "Apply copper oxychloride spray during early stages",
      "Disinfect pruning tools between cuts to avoid spreading bacteria",
      "Avoid injuring the tree during high-humidity periods",
    ],
  },
  "cutting weevil": {
    description:
      "A pest infestation where larvae bore into leaves and shoots, causing wilting and dieback of young growth.",
    remedies: [
      "Prune and destroy affected shoots promptly",
      "Apply neem-based or recommended insecticidal sprays",
      "Monitor new flushes regularly during peak breeding season",
      "Maintain field hygiene by removing fallen infected material",
    ],
  },
  "die back": {
    description:
      "A progressive drying and death of branches starting from the tips, often linked to fungal infection or stress.",
    remedies: [
      "Prune affected branches well below the visibly infected area",
      "Apply a fungicidal paste to pruning wounds",
      "Improve tree vigor with balanced fertilization",
      "Avoid water stress during dry periods",
    ],
  },
  "gall midge": {
    description:
      "Small insect larvae that cause abnormal swellings (galls) on leaves, disrupting normal growth and photosynthesis.",
    remedies: [
      "Remove and destroy galled leaves before larvae mature",
      "Apply recommended systemic insecticide during flush stage",
      "Encourage natural predators like parasitic wasps",
      "Avoid excessive nitrogen fertilization, which promotes tender growth favored by midges",
    ],
  },
  "powdery mildew": {
    description:
      "A fungal disease appearing as a white, powdery coating on leaf surfaces, which can reduce photosynthesis and stunt growth.",
    remedies: [
      "Apply sulfur-based or systemic fungicides at first sign of symptoms",
      "Improve air circulation by pruning dense canopy areas",
      "Avoid excess nitrogen fertilization",
      "Remove and destroy heavily infected leaves",
    ],
  },
  "sooty mould": {
    description:
      "A black fungal growth that develops on honeydew secreted by sap-sucking insects, coating leaves and reducing sunlight absorption.",
    remedies: [
      "Control the underlying insect infestation (aphids, scale, mealybugs) causing honeydew",
      "Wash affected leaves with a mild soap-water solution to remove mould",
      "Apply horticultural oil spray to manage pest populations",
      "Prune overly dense growth to improve airflow and reduce humidity",
    ],
  },
  healthy: {
    description: "No signs of disease detected — this leaf appears to be in good condition.",
    remedies: [],
  },
  },
  hi: {
    anthracnose: {
      description: "एक फफूँद जनित रोग जिससे पत्तियों, फूलों और फलों पर गहरे, धँसे हुए धब्बे बनते हैं और नमी में तेज़ी से फैलता है।",
      remedies: [
        "संक्रमित पत्तियों और टहनियों को काटकर नष्ट करें",
        "नमी वाले मौसम में हर 10-14 दिन पर कॉपर आधारित फफूँदनाशी का छिड़काव करें",
        "ऊपर से सिंचाई (स्प्रिंकलर) से बचें ताकि पत्तियाँ गीली न रहें",
        "हवा के आवागमन के लिए पेड़ों के बीच उचित दूरी रखें",
      ],
    },
    "bacterial canker": {
      description: "एक जीवाणु संक्रमण जिससे पत्तियों और तनों पर पानी जैसे धब्बे और कैंकर बनते हैं, जो समय के साथ शाखाओं को घेर सकते हैं।",
      remedies: [
        "गंभीर रूप से संक्रमित शाखाओं को काटकर जला दें",
        "शुरुआती अवस्था में कॉपर ऑक्सीक्लोराइड का छिड़काव करें",
        "जीवाणु फैलने से रोकने के लिए हर कटाई के बाद औज़ार कीटाणुरहित करें",
        "अधिक नमी के समय पेड़ को चोट पहुँचाने से बचें",
      ],
    },
    "cutting weevil": {
      description: "एक कीट प्रकोप जिसमें इल्लियाँ (लार्वा) पत्तियों और टहनियों में छेद करती हैं, जिससे नई बढ़वार मुरझाकर सूख जाती है।",
      remedies: [
        "प्रभावित टहनियों को तुरंत काटकर नष्ट करें",
        "नीम आधारित या अनुशंसित कीटनाशक का छिड़काव करें",
        "प्रजनन के चरम मौसम में नई कोपलों की नियमित निगरानी करें",
        "गिरी हुई संक्रमित सामग्री हटाकर खेत की स्वच्छता रखें",
      ],
    },
    "die back": {
      description: "टहनियों के सिरे से शुरू होकर शाखाओं का धीरे-धीरे सूखना और मरना, जो अक्सर फफूँद संक्रमण या तनाव से जुड़ा होता है।",
      remedies: [
        "संक्रमित हिस्से से काफ़ी नीचे तक शाखाओं की कटाई करें",
        "कटे हुए भाग पर फफूँदनाशी पेस्ट लगाएँ",
        "संतुलित खाद देकर पेड़ की सेहत सुधारें",
        "सूखे मौसम में पानी की कमी न होने दें",
      ],
    },
    "gall midge": {
      description: "छोटे कीटों के लार्वा जो पत्तियों पर असामान्य गाँठें (गॉल) बनाते हैं, जिससे सामान्य बढ़वार और प्रकाश संश्लेषण बाधित होता है।",
      remedies: [
        "लार्वा के परिपक्व होने से पहले गाँठ वाली पत्तियाँ तोड़कर नष्ट करें",
        "नई कोपलें आने के समय अनुशंसित प्रणालीगत कीटनाशक का उपयोग करें",
        "परजीवी ततैया जैसे प्राकृतिक शत्रुओं को बढ़ावा दें",
        "नाइट्रोजन खाद अधिक न दें, क्योंकि कोमल बढ़वार मिज को आकर्षित करती है",
      ],
    },
    "powdery mildew": {
      description: "एक फफूँद रोग जिसमें पत्तियों की सतह पर सफ़ेद चूर्ण जैसी परत दिखती है, जिससे प्रकाश संश्लेषण घटता है और बढ़वार रुकती है।",
      remedies: [
        "लक्षण दिखते ही सल्फर आधारित या प्रणालीगत फफूँदनाशी का छिड़काव करें",
        "घनी छतरी की छँटाई कर हवा का संचार बढ़ाएँ",
        "नाइट्रोजन खाद अधिक न दें",
        "अत्यधिक संक्रमित पत्तियाँ तोड़कर नष्ट करें",
      ],
    },
    "sooty mould": {
      description: "रस चूसने वाले कीटों द्वारा छोड़े गए मधुरस पर उगने वाली काली फफूँद, जो पत्तियों को ढक लेती है और धूप का अवशोषण घटाती है।",
      remedies: [
        "मधुरस छोड़ने वाले कीटों (एफिड, स्केल, मीलीबग) को नियंत्रित करें",
        "प्रभावित पत्तियों को हल्के साबुन के घोल से धोकर फफूँद हटाएँ",
        "कीट नियंत्रण के लिए हॉर्टिकल्चरल ऑयल का छिड़काव करें",
        "घनी बढ़वार की छँटाई कर हवा का संचार बढ़ाएँ और नमी घटाएँ",
      ],
    },
    healthy: {
      description: "कोई रोग नहीं मिला — यह पत्ती अच्छी स्थिति में दिखती है।",
      remedies: [],
    },
  },
  mr: {
    anthracnose: {
      description: "एक बुरशीजन्य रोग ज्यामुळे पाने, फुले आणि फळांवर गडद, खोलगट डाग पडतात आणि दमट हवामानात तो वेगाने पसरतो.",
      remedies: [
        "संसर्ग झालेली पाने आणि फांद्या छाटून नष्ट करा",
        "दमट हंगामात दर 10-14 दिवसांनी तांबेयुक्त बुरशीनाशकाची फवारणी करा",
        "वरून पाणी देणे (तुषार सिंचन) टाळा, जेणेकरून पाने ओली राहणार नाहीत",
        "हवा खेळती राहावी म्हणून झाडांमध्ये योग्य अंतर ठेवा",
      ],
    },
    "bacterial canker": {
      description: "जिवाणूजन्य संसर्ग ज्यामुळे पाने आणि खोडावर पाणथळ डाग व कॅन्कर तयार होतात, जे कालांतराने फांद्यांना वेढू शकतात.",
      remedies: [
        "गंभीर संसर्ग झालेल्या फांद्या छाटून जाळून टाका",
        "सुरुवातीच्या अवस्थेत कॉपर ऑक्सिक्लोराईडची फवारणी करा",
        "जिवाणू पसरू नयेत म्हणून प्रत्येक छाटणीनंतर अवजारे निर्जंतुक करा",
        "जास्त आर्द्रतेच्या काळात झाडाला इजा होऊ देऊ नका",
      ],
    },
    "cutting weevil": {
      description: "एक कीड प्रादुर्भाव ज्यामध्ये अळ्या पाने आणि कोंबांमध्ये छिद्र पाडतात, त्यामुळे नवीन वाढ कोमेजून वाळते.",
      remedies: [
        "बाधित कोंब त्वरित छाटून नष्ट करा",
        "नीम आधारित किंवा शिफारस केलेल्या कीटकनाशकाची फवारणी करा",
        "प्रजननाच्या हंगामात नवीन पालवीवर नियमित लक्ष ठेवा",
        "गळून पडलेला संसर्गित भाग काढून शेत स्वच्छ ठेवा",
      ],
    },
    "die back": {
      description: "फांद्यांच्या टोकापासून सुरू होऊन त्या हळूहळू वाळत जाणे व मरणे, जे बहुतेकदा बुरशीजन्य संसर्ग किंवा ताणामुळे होते.",
      remedies: [
        "संसर्ग दिसणाऱ्या भागाच्या बऱ्याच खालून फांद्या छाटा",
        "छाटलेल्या जागेवर बुरशीनाशक पेस्ट लावा",
        "संतुलित खत देऊन झाडाची जोम वाढवा",
        "कोरड्या काळात पाण्याचा ताण पडू देऊ नका",
      ],
    },
    "gall midge": {
      description: "लहान किडींच्या अळ्या पानांवर असामान्य गाठी (गॉल) तयार करतात, ज्यामुळे सामान्य वाढ आणि प्रकाशसंश्लेषण बाधित होते.",
      remedies: [
        "अळ्या पूर्ण वाढण्यापूर्वी गाठी असलेली पाने काढून नष्ट करा",
        "पालवीच्या अवस्थेत शिफारस केलेले आंतरप्रवाही कीटकनाशक वापरा",
        "परजीवी गांधीलमाशीसारख्या नैसर्गिक शत्रूंना प्रोत्साहन द्या",
        "नत्रयुक्त खत जास्त देऊ नका, कारण कोवळी वाढ गॉल मिजला आकर्षित करते",
      ],
    },
    "powdery mildew": {
      description: "एक बुरशीजन्य रोग ज्यामध्ये पानांच्या पृष्ठभागावर पांढऱ्या पावडरसारखा थर दिसतो, ज्यामुळे प्रकाशसंश्लेषण कमी होते आणि वाढ खुंटते.",
      remedies: [
        "लक्षणे दिसताच गंधकयुक्त किंवा आंतरप्रवाही बुरशीनाशकाची फवारणी करा",
        "दाट फांद्यांची छाटणी करून हवा खेळती ठेवा",
        "नत्रयुक्त खत जास्त देऊ नका",
        "जास्त बाधित पाने काढून नष्ट करा",
      ],
    },
    "sooty mould": {
      description: "रस शोषणाऱ्या किडींनी सोडलेल्या चिकट स्रावावर वाढणारी काळी बुरशी, जी पाने झाकून टाकते आणि सूर्यप्रकाशाचे शोषण कमी करते.",
      remedies: [
        "चिकट स्राव सोडणाऱ्या किडींचे (मावा, खवले कीड, पिठ्या ढेकूण) नियंत्रण करा",
        "बाधित पाने सौम्य साबणाच्या पाण्याने धुवून बुरशी काढा",
        "कीड नियंत्रणासाठी हॉर्टिकल्चरल ऑइलची फवारणी करा",
        "दाट वाढ छाटून हवा खेळती ठेवा व आर्द्रता कमी करा",
      ],
    },
    healthy: {
      description: "कोणताही रोग आढळला नाही — हे पान चांगल्या स्थितीत दिसते.",
      remedies: [],
    },
  },
};