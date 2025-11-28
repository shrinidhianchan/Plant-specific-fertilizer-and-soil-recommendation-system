import { useState, useRef } from "react";
import {
  AlertCircle,
  CheckCircle,
  Camera,
  Droplet,
  Microscope,
  Zap,
  Leaf,
  Activity,
} from "lucide-react";

// --- Backend API Endpoints ---
const BASE_API_URL = "http://127.0.0.1:8000";
const SOIL_API_URL = `${BASE_API_URL}/api/analyze/soil`; 
const DISEASE_API_URL = `${BASE_API_URL}/api/analyze/disease`; 

/**
 * Improved fetch utility with Timeout and reduced Retries.
 */
const fetchWithTimeout = async (url, options, timeout = 15000, maxRetries = 1) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const config = { ...options, signal: controller.signal };

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, config);
      clearTimeout(id);
      
      if (response.ok) {
        return response;
      }
      
      // Handle 429 (Too Many Requests) specifically
      if (response.status === 429 && attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }
      
      // Read error details if available
      const errorText = await response.text().catch(() => response.statusText);
      let errorMessage = `HTTP Error ${response.status}`;
      try {
         const jsonError = JSON.parse(errorText);
         if (jsonError.detail) errorMessage += `: ${jsonError.detail}`;
      } catch (e) {
         errorMessage += `: ${errorText}`;
      }
      
      throw new Error(errorMessage);

    } catch (error) {
      if (attempt === maxRetries) {
        clearTimeout(id);
        if (error.name === 'AbortError') {
            throw new Error("Request timed out. The server is taking too long to respond.");
        }
        throw error;
      }
    }
  }
};

// --- Component Logic and Definitions ---

const CROP_TYPES = [
  "Wheat",
  "Rice",
  "Corn (Maize)",
  "Cotton",
  "Sugarcane",
  "Tomato",
  "Potato",
  "Soybean",
  "Cabbage",
  "Carrot",
  "Lettuce",
  "Spinach",
  "Onion",
  "Garlic",
];

const SOIL_HEALTH_RANGES = {
    nitrogen: { low: 30, moderate: 60 },
    phosphorus: { low: 20, moderate: 50 },
    potassium: { low: 30, moderate: 60 },
    ph: { acidic: 6.0, alkaline: 7.5 },
    moisture: { dry: 20, wet: 40 },
    organicMatter: { low: 2.0, good: 4.0 },
};

const getRangeStatus = (value, ranges) => {
    if (value < ranges.low) return "Low";
    if (value < ranges.moderate) return "Moderate";
    return "High";
}

const getPhStatus = (ph) => {
    if (ph < 6) return "Acidic";
    if (ph < 7.5) return "Neutral";
    return "Alkaline";
}

const getMoistureStatus = (moisture) => {
    if (moisture < 20) return "Dry";
    if (moisture < 40) return "Optimal";
    return "Wet";
}

const getOrganicMatterStatus = (om) => {
    if (om < 2) return "Low";
    if (om < 4) return "Good";
    return "High";
}

export default function Analyze() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [cropType, setCropType] = useState("Tomato");
  const [diseaseFile, setDiseaseFile] = useState(null);
  const [diseasePreview, setDiseasePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [inputs, setInputs] = useState({
    nitrogen: 50,
    phosphorus: 40,
    potassium: 35,
    ph: 6.8,
    moisture: 28,
    organicMatter: 3.2,
  });

  const handleDiseaseFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }
      setDiseaseFile(selectedFile);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setDiseasePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDiseaseDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      const input = fileInputRef.current;
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(droppedFile);
        input.files = dataTransfer.files;
        handleDiseaseFileChange({ target: input });
      }
    }
  };

  const handleDiseaseDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleInputChange = (field, value) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setInputs((prev) => ({
        ...prev,
        [field]: numValue,
      }));
    }
  };

  const handleAnalyze = async () => {
    if (!cropType) {
      setError("Please select a crop type");
      return;
    }
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    const payload = {
      plant_species: cropType,
      N: inputs.nitrogen,
      P: inputs.phosphorus,
      K: inputs.potassium,
      pH: inputs.ph,
    };

    try {
      const response = await fetchWithTimeout(SOIL_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const resultData = await response.json();
      
      if (!resultData || !resultData.recommended_fertilizer || !resultData.soil_improvement_focus) {
        throw new Error("Backend returned invalid soil analysis data structure.");
      }

      const mockScore = (inputs.nitrogen > 30 && inputs.phosphorus > 20 && inputs.potassium > 30) ? 85 : 65;
      const status = mockScore > 80 ? "Excellent" : mockScore > 60 ? "Good" : "Fair";
      const statusColor = mockScore > 80 ? "text-green-600" : mockScore > 60 ? "text-yellow-600" : "text-orange-600";
      
      const recParts = resultData.recommended_fertilizer.match(/(.*)\((.*)\)/);
      const fertilizerName = recParts ? recParts[1].trim() : resultData.recommended_fertilizer;
      const quantity = recParts ? recParts[2] : "See advice below";

      setResult({
        type: "soil",
        soilHealth: {
            score: mockScore,
            status: status,
            statusColor: statusColor,
            issues: [
              `Recommendation: ${resultData.recommended_fertilizer}`,
              `Focus: ${resultData.soil_improvement_focus}`
            ]
        },
        recommendations: [
          {
            fertilizer: fertilizerName,
            quantity: quantity,
            timing: resultData.soil_improvement_focus, 
          }
        ],
        cropType: cropType,
        soilData: inputs, 
      });

    } catch (err) {
      console.error("Soil Analysis Error:", err);
      setError(`Soil Analysis failed: ${err.message}. Ensure backend is running.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeDisease = async () => {
    if (!diseaseFile) {
      setError("Please upload a plant image for disease detection");
      return;
    }
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", diseaseFile);
    
    try {
      // Using the robust fetchWithTimeout utility
      const response = await fetchWithTimeout(DISEASE_API_URL, {
        method: 'POST',
        body: formData
      });
      
      const resultData = await response.json();

      if (!resultData || typeof resultData.detected_issue === 'undefined') {
        throw new Error("Backend returned invalid disease analysis data structure.");
      }
      
      const severity = resultData.confidence_score > 85 ? "High" : resultData.confidence_score > 60 ? "Moderate" : "Low";
      const combinedAdvice = `The model detected ${resultData.detected_issue} with a confidence of ${resultData.confidence_score.toFixed(1)}%. Immediate application of the recommended treatment is advised to prevent spread.`;

      setResult({
        type: "disease",
        diseaseDetected: true,
        diseaseName: resultData.detected_issue,
        severity: severity,
        confidence: `${resultData.confidence_score.toFixed(1)}%`,
        treatment: [
          {
            name: "Recommended Action",
            product: resultData.treatment,
            frequency: "Immediate application recommended.",
          }
        ],
        prevention: [
          "Ensure proper air circulation around plants.",
          "Avoid overhead watering late in the day.",
          "Remove and destroy infected plant debris promptly."
        ],
        combinedAdvice: combinedAdvice,
      });

    } catch (err) {
      console.error("Disease Analysis Error:", err);
      setError(`Disease analysis failed: ${err.message}. Check backend console.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearAll = () => {
    setDiseaseFile(null);
    setDiseasePreview(null);
    setResult(null);
    setError(null);
    setCropType("Tomato"); 
    setInputs({
      nitrogen: 50,
      phosphorus: 40,
      potassium: 35,
      ph: 6.8,
      moisture: 28,
      organicMatter: 3.2,
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-golden-yellow/30 via-fresh-green/10 to-background py-12 px-4 bg-lime-950">
      <style>{`
        /* Custom scrollbar for better aesthetics */
        .max-h-\[800px\]::-webkit-scrollbar {
          width: 8px;
        }
        .max-h-\[800px\]::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .max-h-\[800px\]::-webkit-scrollbar-thumb {
          background: #4d7c0f; /* forest-green */
          border-radius: 10px;
        }
        .max-h-\[800px\]::-webkit-scrollbar-thumb:hover {
          background: #365314; /* darker forest-green */
        }

        /* Custom range slider styling */
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #4d7c0f; /* forest-green */
          cursor: pointer;
          border: 3px solid #fff;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
          transition: background 0.3s, transform 0.1s;
        }

        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #4d7c0f;
          cursor: pointer;
          border: 3px solid #fff;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
          transition: background 0.3s;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-slide-in-left {
          animation: fadeIn 0.6s ease-out forwards;
        }
        .animate-slide-in-right {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-white">
          <h1 className="text-5xl lg:text-6xl font-black bg-clip-text text-transparent leading-tight text-white">
            SOIL & DISEASE ANALYSIS
          </h1>
          <p className="text-lg text-white/80 mt-2 font-medium">
            Get AI-powered recommendations based on soil nutrients and plant health
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Inputs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Soil Analysis Card */}
            <div className="bg-lime-100  text-lime-950 rounded-2xl p-8 border-2 border-lime-700/20 shadow-xl space-y-6 animate-slide-in-left">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-lime-800 to-lime-600 rounded-lg">
                  <Droplet className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-black text-lime-950">
                  Soil Analysis
                </h3>
              </div>

              {/* Crop Type Dropdown */}
              <div className="space-y-2 animate-fade-in">
                <label className="block text-sm font-bold text-lime-950">
                  🌾 Select Crop Type
                </label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-lime-700/30 bg-white focus:outline-none focus:ring-2 focus:ring-lime-700/50 focus:border-lime-700 transition-all font-medium text-lime-950"
                >
                  <option value="">Choose a crop...</option>
                  {CROP_TYPES.map((crop) => (
                    <option key={crop} value={crop}>
                      {crop}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nitrogen */}
              <div className="space-y-3 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-lime-950">
                    🔴 Nitrogen (N): {inputs.nitrogen.toFixed(1)} mg/kg
                  </label>
                  <span className="text-xs font-bold px-3 py-1 bg-red-100 text-red-700 rounded-full">
                    {getRangeStatus(inputs.nitrogen, SOIL_HEALTH_RANGES.nitrogen)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={inputs.nitrogen}
                  onChange={(e) => handleInputChange("nitrogen", e.target.value)}
                  className="w-full h-3 bg-gradient-to-r from-red-300 to-red-500 rounded-lg"
                />
              </div>

              {/* Phosphorus */}
              <div className="space-y-3 animate-fade-in" style={{ animationDelay: "0.15s" }}>
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-lime-950">
                    🟡 Phosphorus (P): {inputs.phosphorus.toFixed(1)} mg/kg
                  </label>
                  <span className="text-xs font-bold px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                    {getRangeStatus(inputs.phosphorus, SOIL_HEALTH_RANGES.phosphorus)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={inputs.phosphorus}
                  onChange={(e) => handleInputChange("phosphorus", e.target.value)}
                  className="w-full h-3 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-lg"
                />
              </div>

              {/* Potassium */}
              <div className="space-y-3 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-lime-950">
                    🟢 Potassium (K): {inputs.potassium.toFixed(1)} mg/kg
                  </label>
                  <span className="text-xs font-bold px-3 py-1 bg-green-100 text-green-700 rounded-full">
                    {getRangeStatus(inputs.potassium, SOIL_HEALTH_RANGES.potassium)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={inputs.potassium}
                  onChange={(e) => handleInputChange("potassium", e.target.value)}
                  className="w-full h-3 bg-gradient-to-r from-green-300 to-green-500 rounded-lg"
                />
              </div>

              {/* pH */}
              <div className="space-y-3 animate-fade-in" style={{ animationDelay: "0.25s" }}>
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-lime-950">
                    🌡️ Soil pH: {inputs.ph.toFixed(1)}
                  </label>
                  <span className="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {getPhStatus(inputs.ph)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="14"
                  step="0.1"
                  value={inputs.ph}
                  onChange={(e) => handleInputChange("ph", e.target.value)}
                  className="w-full h-3 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 rounded-lg"
                />
              </div>

              {/* Moisture */}
              <div className="space-y-3 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-lime-950">
                    💧 Moisture: {inputs.moisture.toFixed(1)}%
                  </label>
                  <span className="text-xs font-bold px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full">
                    {getMoistureStatus(inputs.moisture)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={inputs.moisture}
                  onChange={(e) => handleInputChange("moisture", e.target.value)}
                  className="w-full h-3 bg-gradient-to-r from-orange-300 to-cyan-500 rounded-lg"
                />
              </div>

              {/* Organic Matter */}
              <div className="space-y-3 animate-fade-in" style={{ animationDelay: "0.35s" }}>
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-lime-950">
                    🍂 Organic Matter: {inputs.organicMatter.toFixed(1)}%
                  </label>
                  <span className="text-xs font-bold px-3 py-1 bg-amber-100 text-amber-700 rounded-full">
                    {getOrganicMatterStatus(inputs.organicMatter)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={inputs.organicMatter}
                  onChange={(e) => handleInputChange("organicMatter", e.target.value)}
                  className="w-full h-3 bg-gradient-to-r from-amber-300 to-amber-600 rounded-lg"
                />
              </div>

              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-100 border-2 border-red-300 rounded-lg animate-fade-in text-lime-950">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-red-700 text-sm font-bold">{error}</span>
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full px-6 py-4 bg-lime-950 text-white font-bold rounded-lg hover:shadow-2xl disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.01] text-lg active:scale-100"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Analyzing Soil...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 text-white" />
                    Analyze Soil Health
                  </>
                )}
              </button>
            </div>

            {/* Disease Detection Section */}
            <div className="bg-lime-100 rounded-2xl p-8 border-2 border-orange-300/30 shadow-lg space-y-6 animate-slide-in-left">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-lime-950 to-lime-600 rounded-lg">
                  <Microscope className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-black text-lime-950">
                  Disease Detection
                </h3>
              </div>

              <p className="text-lime-800 font-medium">
                Upload a plant image to detect diseases early and get treatment recommendations.
              </p>

              {!diseasePreview ? (
                <div
                  onDrop={handleDiseaseDrop}
                  onDragOver={handleDiseaseDragOver}
                  className="border-3 border-dashed border-orange-400/50 rounded-xl p-8 text-center hover:border-orange-400/80 hover:bg-orange-50 transition-all cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-10 h-10 text-lime-950 mx-auto mb-3 animate-pulse" />
                  <p className="text-sm font-bold text-lime-950 mb-1">Drop plant image or click to upload</p>
                  <p className="text-xs text-lime-700">Supports JPG, PNG, and other image formats</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleDiseaseFileChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden border-2 border-orange-300/50">
                    <img src={diseasePreview} alt="Plant Preview" className="w-full h-64 object-cover" />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleAnalyzeDisease}
                      disabled={isAnalyzing}
                      className="flex-1 py-3 bg-lime-950 text-white font-bold rounded-lg hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] text-base active:scale-100"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Detecting...
                        </>
                      ) : (
                        <>
                          <Microscope className="w-5 h-5" />
                          Detect Disease
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setDiseaseFile(null);
                        setDiseasePreview(null);
                        setError(null);
                      }}
                      className="px-4 py-3 border-2 border-lime-950 text-lime-700 font-bold rounded-lg hover:bg-orange-50 transition active:scale-95"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Soil Health Dashboard & Results */}
          <div className="animate-slide-in-right">
            {result ? (
              <div className="bg-lime-100 rounded-2xl p-8 border-2 border-lime-700/20 shadow-2xl max-h-[800px] overflow-y-auto space-y-6 sticky top-8">
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-green-50 border-2 border-green-300 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 animate-pulse" />
                  <span className="text-green-700 font-bold">✅ Analysis Complete</span>
                </div>

                {result.type === "soil" && (
                  <>
                    {/* Soil Health Dashboard */}
                    <div>
                      <h3 className="text-lg font-black text-lime-950 mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-lime-950" />
                        Soil Health Score
                      </h3>
                      <div className="p-6 bg-gradient-to-br from-lime-50 to-lime-100 border-2 border-lime-700/30 rounded-lg text-center">
                        <div className={`text-5xl font-black mb-2 ${result.soilHealth.statusColor}`}>
                          {result.soilHealth.score}%
                        </div>
                        <p className={`text-2xl font-bold ${result.soilHealth.statusColor}`}>
                          {result.soilHealth.status}
                        </p>
                        {result.soilHealth.issues.length > 0 && (
                          <div className="mt-4 space-y-2 text-left">
                            {result.soilHealth.issues.map((issue, idx) => (
                              <p key={idx} className="text-sm text-orange-600 font-medium">
                                {issue}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h3 className="text-lg font-black text-lime-950 mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-lime-950" />
                        Fertilizer Recommendations
                      </h3>
                      <div className="space-y-3">
                        {result.recommendations.length > 0 ? (
                          result.recommendations.map((rec, idx) => (
                            <div
                              key={idx}
                              className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-golden-yellow rounded-lg border-orange-400"
                            >
                              <p className="font-bold text-sm mb-2 text-lime-950">
                                {rec.fertilizer}
                              </p>
                              <div className="space-y-1 text-xs text-lime-800 font-medium">
                                <p>📊 {rec.quantity}</p>
                                <p>⏰ {rec.timing}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-green-600 font-medium">
                            ✅ Soil parameters are optimal. Maintain current practices.
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {result.type === "disease" && (
                  <>
                    <div className="p-4 bg-gradient-to-r from-orange-100 to-pink-100 border-2 border-orange-400 rounded-lg">
                      <p className="font-bold text-orange-900 text-lg">{result.diseaseName}</p>
                      <p className="text-sm text-orange-800 mt-2 flex gap-4">
                        <span>🔴 Severity: <strong>{result.severity}</strong></span>
                        <span>🎯 Confidence: <strong>{result.confidence}</strong></span>
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-lime-950 mb-3 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-orange-600" />
                        Treatment Options
                      </h3>
                      <div className="space-y-3">
                        {result.treatment.map((item, idx) => (
                          <div key={idx} className="p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-lg">
                            <p className="font-bold text-emerald-900">{item.name}</p>
                            <p className="text-sm text-emerald-700 mt-1">📦 {item.product}</p>
                            <p className="text-sm text-emerald-700 mt-1">⏱️ {item.frequency}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-lime-950 mb-3 flex items-center gap-2">
                        <Leaf className="w-5 h-5 text-green-600" />
                        Prevention Strategies
                      </h3>
                      <ul className="space-y-2 list-inside">
                        {result.prevention.map((strategy, idx) => (
                          <li key={idx} className="flex items-start gap-3 p-2">
                            <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-lime-950 text-sm">{strategy}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
                      <h3 className="font-bold text-blue-900 mb-2">💡 Expert Advice</h3>
                      <p className="text-sm text-blue-800">
                        {result.combinedAdvice}
                      </p>
                    </div>
                  </>
                )}

                <button
                  onClick={clearAll}
                  className="w-full px-4 py-3 border-2 bg-lime-950 text-white font-bold rounded-lg hover:opacity-90 transition active:scale-95"
                >
                  Analyze Again
                </button>
              </div>
            ) : (
              <div className="bg-lime-950 rounded-2xl p-8 border-2 border-lime-700/20 h-full flex items-center justify-center min-h-96 sticky top-8">
                <div className="text-center">
                  <Activity className="w-12 h-12 text-green-400 mx-auto mb-4 animate-pulse" />
                  <p className="font-bold text-white/80">
                    Enter soil parameters and click<br />
                    <span className="text-white">"Analyze Soil Health"</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}