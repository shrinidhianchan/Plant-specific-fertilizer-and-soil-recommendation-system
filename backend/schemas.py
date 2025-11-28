from pydantic import BaseModel, Field
from typing import Optional, List

# --- Input Schema for Structured Data (Soil Analysis) ---
class FertilizerInput(BaseModel):
    """
    Schema for required soil nutrient and condition data.
    Matches the JSON sent by the Analyze.jsx frontend.
    """
    N: float = Field(..., description="Nitrogen content (e.g., 90)")
    P: float = Field(..., description="Phosphorus content (e.g., 42)")
    K: float = Field(..., description="Potassium content (e.g., 43)")
    pH: float = Field(..., description="Soil pH value (e.g., 6.5)")
    plant_species: str = Field(..., description="The type of crop/plant (e.g., 'rice')")

# --- Output Schema for Predictions ---
class PredictionOutput(BaseModel):
    """
    Schema for the fertilizer prediction result.
    """
    recommended_fertilizer: str
    soil_improvement_focus: str

class ImageRecommendationOutput(BaseModel):
    """
    Schema for the image-based disease detection result.
    """
    detected_issue: str
    treatment: str
    confidence_score: float

# --- Error Schema ---
class ErrorResponse(BaseModel):
    detail: str