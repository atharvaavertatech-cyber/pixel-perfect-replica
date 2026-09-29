<h1 align="center">Mango Leaf Disease Detector</h1> <p align="center"> An AI-powered tool that identifies diseases in mango leaves from a photo. Upload a picture of a leaf, and the app tells you what's wrong with it (if anything) and how to treat it. </p> <p align="center"> <img src="photos/screenshot.png" alt="App Screenshot" width="700"> </p>
What It Does
You upload a photo of a mango leaf
A trained deep learning model analyzes the image
You get back a diagnosis — the disease name, a confidence score, and a short explanation
If a disease is detected, you also get a list of practical remedies
If the leaf is healthy, you get a simple confirmation instead
Supported Conditions

The model can identify 8 categories:

Anthracnose
Bacterial Canker
Cutting Weevil
Die Back
Gall Midge
Healthy
Powdery Mildew
Sooty Mould
How It Works

Frontend: A React app (built with TanStack Query) laid out across three cards — upload, diagnosis, and remedies. You drop in a leaf photo, and it calls the backend API, then displays the disease name, confidence score, description, and remedy list. Validates file type (PNG/JPEG) and size (under 10MB) before sending. Includes clear loading, error, and success states, plus a disclaimer noting this is an AI-assisted estimate rather than a professional diagnosis.

Backend: A FastAPI server running an EfficientNetB7-based image classification model, trained specifically on mango leaf images. When you upload a photo, the server resizes it, runs it through the model, and returns the predicted disease along with a confidence score and the full ranked breakdown across all 8 classes.

Model: Built on EfficientNetB7 (pretrained on ImageNet, fine-tuned on the mango leaf dataset). Trained using TensorFlow/Keras in Google Colab.

Screenshots
<p align="center"> <img src="photos/Screenshot 2026-09-29 111659.png" alt="App Screenshot" width="700"> </p>
Running It Locally

Backend:

pip install -r requirements.txt
uvicorn app:app --reload --host 0.0.0.0 --port 8000

Visit http://localhost:8000/docs to test the /predict endpoint directly from your browser.

Frontend:

cd pixel-perfect-replica-main
npm install
npm run dev

Set VITE_API_BASE_URL in a .env file to point at your running backend (defaults to http://localhost:8000).

Project Structure
├── app.py                          # FastAPI backend
├── class_labels.json               # Class label mapping
├── mango_leaf_disease_model.keras  # Trained classifier
├── model/                          # Model-related files
├── yolo model/                     # YOLO detection weights (future upgrade)
├── pixel-perfect-replica-main/     # React frontend
├── photos/                         # Screenshots and reference images
├── requirements.txt                # Python dependencies
└── README.md
API

POST /predict
Send a multipart/form-data request with a file field containing an image (PNG or JPEG, under 10MB).

Response:

json
{
  "predicted_class": "Anthracnose",
  "confidence": 0.87,
  "all_predictions": [
    {"label": "Anthracnose", "confidence": 0.87},
    {"label": "Bacterial Canker", "confidence": 0.06}
  ]
}
A Note on Accuracy

This is an AI-assisted estimate, not a substitute for expert diagnosis. For severe or recurring infections, consult a local agricultural expert.

Tech Stack
Frontend: React, TypeScript, TanStack Query
Backend: FastAPI, Python
Model: TensorFlow/Keras, EfficientNetB7
Training: Google Colab