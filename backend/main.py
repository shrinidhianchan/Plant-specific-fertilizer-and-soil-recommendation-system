import fastapi
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError
from typing import List, Optional

# --- REQUIRED IMPORTS FOR IMAGE PROCESSING ---
from io import BytesIO
from PIL import Image
import numpy as np
# ---------------------------------------------

# Use absolute local imports
from schemas import FertilizerInput, PredictionOutput, ErrorResponse, ImageRecommendationOutput
from services import load_models, predict_fertilizer

# Initialize FastAPI app
app = FastAPI(
    title="AgriSense ML API",
    description="API for Plant-Specific Fertilizer and Soil Recommendations.",
)

# --- CORS Configuration ---
# Allows the frontend running on localhost:5173 (or any other port) to connect.
origins = [
    "*", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Global Model Variables ---
fertilizer_model = None
disease_model = None

# --- Startup Event (Model Loading) ---
@app.on_event("startup")
def startup_event():
    """Loads the ML models from disk when the FastAPI application starts up."""
    global fertilizer_model, disease_model
    print("INFO: Attempting to load ML models...")
    try:
        fertilizer_model, disease_model = load_models()
        print("INFO: Fertilizer model loaded successfully.")
        print("INFO: Disease model loaded successfully.")
    except Exception as e:
        print(f"ERROR: Failed to load models: {e}")

# --- Root Endpoint (Health Check) ---
@app.get("/")
def read_root():
    """Simple status and health check for the API."""
    return {
        "title": app.title,
        "version": "1.0",
        "status": "online",
        "fertilizer_model_ready": fertilizer_model is not None,
        "disease_model_ready": disease_model is not None
    }

# --- Endpoint 1: Soil Analysis (Fixed Logic) ---
@app.post(
    "/api/analyze/soil",
    response_model=PredictionOutput,
    responses={400: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
    summary="Get fertilizer and soil health recommendation.",
)
async def structured_prediction(data: FertilizerInput):
    """
    Receives structured soil data (N, P, K, pH, species) and returns a recommendation.
    """
    if fertilizer_model is None:
        raise HTTPException(status_code=503, detail="Fertilizer model not yet loaded or failed to load.")

    try:
        # FIX: Use the individual fields directly from the Pydantic model.
        # No string splitting needed anymore.
        # Ensure this order matches exactly what your model expects during training!
        # Common order: [Crop, pH, N, P, K] OR [N, P, K, pH, Crop]
        # Based on your previous code, it seemed to be [Crop, pH, N, P, K]
        
        features = [
            data.plant_species,
            data.pH,
            data.N,
            data.P,
            data.K
        ]
        
        # Pass features to the service function
        recommendation_result = predict_fertilizer(features)
        
        return PredictionOutput(
            recommended_fertilizer=recommendation_result["fertilizer"],
            soil_improvement_focus=recommendation_result["focus"],
        )

    except Exception as e:
        print(f"Prediction Error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Prediction service error: {str(e)}",
        )

# --- Endpoint 2: Disease Detection (Full Implementation) ---
@app.post(
    "/api/analyze/disease",
    response_model=ImageRecommendationOutput,
    summary="Detect plant disease from an uploaded image.",
)
async def image_prediction(file: bytes = fastapi.File(...)):
    """Receives a soil or plant image and returns a classification."""
    if disease_model is None:
        raise HTTPException(status_code=503, detail="Disease model not yet loaded or failed to load.")

    # --- CONFIGURATION ---
    # Ensure TARGET_SIZE matches your model training (e.g., 224x224 or 256x256)
    TARGET_SIZE = (224, 224) 
    
    # Full 38-Class List (Alphabetical Order from Kaggle Dataset)
    CLASS_NAMES = [
        "Apple___Apple_scab",
        "Apple___Black_rot",
        "Apple___Cedar_apple_rust",
        "Apple___healthy",
        "Blueberry___healthy",
        "Cherry_(including_sour)___Powdery_mildew",
        "Cherry_(including_sour)___healthy",
        "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
        "Corn_(maize)___Common_rust_",
        "Corn_(maize)___Northern_Leaf_Blight",
        "Corn_(maize)___healthy",
        "Grape___Black_rot",
        "Grape___Esca_(Black_Measles)",
        "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
        "Grape___healthy",
        "Orange___Haunglongbing_(Citrus_greening)",
        "Peach___Bacterial_spot",
        "Peach___healthy",
        "Pepper,_bell___Bacterial_spot",
        "Pepper,_bell___healthy",
        "Potato___Early_blight",
        "Potato___Late_blight",
        "Potato___healthy",
        "Raspberry___healthy",
        "Soybean___healthy",
        "Squash___Powdery_mildew",
        "Strawberry___Leaf_scorch",
        "Strawberry___healthy",
        "Tomato___Bacterial_spot",
        "Tomato___Early_blight",
        "Tomato___Late_blight",
        "Tomato___Leaf_Mold",
        "Tomato___Septoria_leaf_spot",
        "Tomato___Spider_mites_Two-spotted_spider_mite",
        "Tomato___Target_Spot",
        "Tomato___Tomato_mosaic_virus",
        "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
        "Tomato___healthy"
    ]
    
    # Generate basic treatment plans
    TREATMENT_PLANS = {
        name: "Maintain standard care and monitoring." if "healthy" in name else "Consult agricultural expert for specific fungicide/treatment plan."
        for name in CLASS_NAMES
    }
    
    # Specific Overrides for Common Diseases
    TREATMENT_PLANS["Apple___Black_rot"] = "Prune out diseased wood; apply fungicide (Captan or Sulfur)."
    TREATMENT_PLANS["Apple___Apple_scab"] = "Apply fungicides (Myclobutanil) and remove fallen leaves."
    TREATMENT_PLANS["Potato___Early_blight"] = "Apply fungicides containing chlorothalonil or mancozeb."
    TREATMENT_PLANS["Potato___Late_blight"] = "Destroy infected plants immediately; apply systemic fungicide."
    TREATMENT_PLANS["Tomato___Bacterial_spot"] = "Apply copper-based bactericides; avoid overhead watering."
    TREATMENT_PLANS["Tomato___Early_blight"] = "Remove infected leaves; apply copper fungicide or chlorothalonil."
    TREATMENT_PLANS["Tomato___Late_blight"] = "Highly contagious. Remove plants; use systemic fungicides like metalaxyl."
    TREATMENT_PLANS["Tomato___Leaf_Mold"] = "Improve air circulation; reduce humidity; apply fungicide."
    TREATMENT_PLANS["Tomato___Septoria_leaf_spot"] = "Remove lower leaves; apply chlorothalonil-based fungicide."
    TREATMENT_PLANS["Tomato___Target_Spot"] = "Apply fungicides; improve air circulation."
    TREATMENT_PLANS["Tomato___Tomato_Yellow_Leaf_Curl_Virus"] = "Control whiteflies; remove infected plants (no cure)."
    TREATMENT_PLANS["Tomato___Tomato_mosaic_virus"] = "Disinfect tools; remove infected plants (no cure)."

    try:
        # 1. Convert bytes to PIL Image object
        image = Image.open(BytesIO(file)).convert("RGB") 
        
        # 2. Resize and Preprocess Image
        image = image.resize(TARGET_SIZE)
        image_array = np.asarray(image, dtype=np.float32)
        
        # Normalize the image (Standard for most CNNs is 0-1)
        image_array = image_array / 255.0
        
        # Add the batch dimension (1, H, W, C)
        input_data = np.expand_dims(image_array, axis=0)
        
        # 3. Run the Model Prediction
        predictions = disease_model.predict(input_data) 
        
        # 4. Map the Output to a Result
        predicted_class_index = np.argmax(predictions[0])
        
        # Calculate confidence score
        confidence = float(np.max(predictions[0]) * 100)
        
        if predicted_class_index < len(CLASS_NAMES):
            detected_issue = CLASS_NAMES[predicted_class_index]
        else:
            detected_issue = "Unknown Issue"

        treatment = TREATMENT_PLANS.get(detected_issue, "Consult agricultural expert.")
        
        # Return the actual prediction
        return ImageRecommendationOutput(
            detected_issue=detected_issue,
            treatment=treatment,
            confidence_score=confidence,
        )

    except Exception as e:
        print(f"Image Analysis Error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Image prediction service error: {str(e)}",
        )