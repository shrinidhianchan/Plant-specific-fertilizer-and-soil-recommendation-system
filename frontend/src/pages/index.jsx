import { Link } from "react-router-dom";
import {
  Upload,
  Leaf,
  Zap,
  Globe,
  TrendingUp,
  Shield,
  Droplet,
  Microscope,
  ArrowRight,
} from "lucide-react";

export default function Index() {
  const features = [
    {
      icon: Droplet,
      title: "Soil Analysis",
      description:
        "Advanced AI models detect soil type, texture, pH, and nutrient levels from image analysis",
    },
    {
      icon: Zap,
      title: "Smart Recommendations",
      description:
        "Get personalized fertilizer recommendations based on NPK values, soil type, and plant requirements",
    },
    {
      icon: Microscope,
      title: "Disease Detection",
      description:
        "Identify plant diseases early using image recognition and AI models for quick intervention",
    },
    {
      icon: TrendingUp,
      title: "Crop Optimization",
      description:
        "Determine which plants grow best in your soil conditions with data-driven insights",
    },
    {
      icon: Shield,
      title: "Sustainability Focus",
      description:
        "Reduce fertilizer misuse and promote sustainable farming practices for better yields",
    },
    {
      icon: Globe,
      title: "Farmer-Friendly",
      description:
        "Simple interface designed for all farmers, regardless of technical background",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-golden-yellow/20 via-background to-background">
      {/* Full-Cover Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image - Full Cover */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F0d9b961321f04c659dd9445b99ef5771%2Faba9a4e5fd774be1ac9dbdbdf0080211?format=webp&width=1600"
            alt="Agricultural field"
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <div className="inline-block bg-white/20 backdrop-blur-md px-6 py-3 rounded-full mb-6 animate-slide-in-left border border-white/30">
            <span className="text-white font-semibold text-sm tracking-wide">
              ✨ AI-Powered Soil Intelligence
            </span>
          </div>

          <h1 className="text-6xl lg:text-7xl font-black text-white mb-6 leading-tight animate-slide-in-left drop-shadow-lg" style={{ animationDelay: "0.1s" }}>
            Smart Fertilizer
            <span className="block text-golden-yellow"> Recommendations</span>
          </h1>

          <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed font-medium animate-slide-in-right drop-shadow-md" style={{ animationDelay: "0.2s" }}>
            Upload soil images and input NPK values. Get AI-powered fertilizer advice tailored to your crops and soil conditions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Link
              to="/analyze"
              className="inline-flex items-center justify-center px-8 py-4 bg-forest-green text-white font-bold rounded-lg hover:bg-forest-green/90 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <Upload className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Analyze Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/20 backdrop-blur-md border-2 border-white text-white font-bold rounded-lg hover:bg-white/30 transition-all duration-300 group hover:shadow-lg"
            >
              Learn More
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <div className="text-white/60 text-xs font-medium"></div>
          <div className="mt-2 flex justify-center">
            <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Why Choose AgriSense Section */}
      <section className="py-20 bg-white border-y border-border px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-lime-950 lg:text-5xl font-black text-foreground mb-4 animate-fade-in">
              Why Choose AGRISENSE
            </h2>
            <p className="text-lg text-lime-950 text-muted-foreground max-w-2xl mx-auto animate-fade-in font-medium" style={{ animationDelay: "0.1s" }}>
              Two powerful AI models working together to give you complete farm management insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-8 rounded-2xl bg-lime-950 text-white border-2 border-forest-green/10 hover:border-forest-green/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                  style={{ animationDelay: `${(index + 1) * 0.08}s` }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-forest-green/10 to-fresh-green/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gradient-to-br group-hover:from-forest-green/20 group-hover:to-fresh-green/20 transition-all duration-300 group-hover:scale-110 transform">
                    <Icon className="w-6 h-6 text-forest-green group-hover:text-fresh-green transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-forest-green transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300 font-medium">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-lime-950 lg:text-5xl font-black text-foreground mb-4 animate-fade-in">
              How AgriSense Works
            </h2>
            <p className="text-lg text-lime-950 text-muted-foreground max-w-2xl mx-auto animate-fade-in font-medium" style={{ animationDelay: "0.1s" }}>
              Three simple steps to get insights about your soil and crops
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white text-lime-950">
            {[
              {
                step: "1",
                title: "Input Soil Parameters",
                description:
                  "Enter your soil's nitrogen, phosphorus, potassium, pH, moisture, and organic matter levels using simple sliders",
              },
              {
                step: "2",
                title: "Select Your Crop",
                description:
                  "Choose the crop you're growing to get customized fertilizer recommendations for your specific plant",
              },
              {
                step: "3",
                title: "Monitor Plant Health",
                description:
                  "Upload plant images anytime to detect diseases early and get treatment recommendations",
              },
            ].map((item, index) => (
              <div
                key={item.step}
                className="relative animate-fade-in"
                style={{ animationDelay: `${(index + 1) * 0.15}s` }}
              >
                <div className="bg-white rounded-2xl p-8 border-2  h-full hover:shadow-xl hover:border transition-all duration-300">
                  <div className="absolute -top-6 left-8 w-12 h-12 bg-lime-950 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-lg group-hover:animate-pulse">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mt-4 mb-3 text-lime-950">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed font-medium text-lime-950">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Models Section */}
      <section className="py-20 bg-gradient-to-r from-earth-brown/10 to-golden-yellow/10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl text-lime-950 font-black text-foreground mb-4 animate-fade-in">
              Advanced AI Technology
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Model 1 */}
            <div className="bg-lime-950 rounded-2xl p-8 border-2 border-forest-green/20 shadow-lg hover:shadow-2xl transition-all duration-300 animate-slide-in-left hover:-translate-y-2">
              <div className="w-14 h-14 bg-forest-green/10 rounded-xl flex items-center justify-center mb-6">
                <Droplet className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl text-white font-black text-foreground mb-4">
                Soil NPK Analysis
              </h3>
              <p className="text-muted-foreground text-white mb-6 leading-relaxed font-medium">
                Intelligent analysis of nitrogen, phosphorus, and potassium levels. Measures pH, moisture, and provides plant-specific fertilizer recommendations.
              </p>
              <ul className="space-y-3 text-white">
                {[
                  "NPK value analysis",
                  "pH level assessment",
                  "Optional image processing",
                  "Plant-specific recommendations",
                  "Best growth conditions",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-forest-green rounded-full flex-shrink-0"></div>
                    <span className="text-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Model 2 */}
            <div className="bg-lime-900 rounded-2xl p-8 border-2 border-earth-brown/20 shadow-lg hover:shadow-2xl transition-all duration-300 animate-slide-in-right hover:-translate-y-2">
              <div className="w-14 h-14 bg-earth-brown/10 rounded-xl flex items-center justify-center mb-6">
                <Microscope className="w-8 h-8 text-amber-950" />
              </div>
              <h3 className="text-2xl text-white font-black text-foreground mb-4">
                Disease Detection
              </h3>
              <p className="text-muted-foreground text-white mb-6 leading-relaxed font-medium">
                Detects plant diseases early from leaf and plant images. Provides identification, severity assessment, and treatment recommendations.
              </p>
              <ul className="space-y-3 text-white">
                {[
                  "Disease identification",
                  "Severity assessment",
                  "Early detection",
                  "Treatment options",
                  "Prevention strategies",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-earth-brown rounded-full flex-shrink-0"></div>
                    <span className="text-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-forest-green to-earth-brown px-4 animate-fade-in">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-lime-950 mb-4 drop-shadow-lg">
            Ready to Optimize Your Farm?
          </h2>
          <p className="text-lg lg:text-xl text-lime-950 mb-10 max-w-2xl mx-auto font-medium drop-shadow-md leading-relaxed">
            Start using AI-powered fertilizer recommendations today. Make smarter decisions for your crops and soil health.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/analyze"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-forest-green font-bold rounded-lg hover:bg-white/90 transition-all duration-300 hover:shadow-2xl group hover:-translate-y-1 transform"
            >
              <Zap className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform text-lime-950" />
              Start Analysis
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform text-lime-950" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-lime-900 text-white bg-lime-900 font-bold rounded-lg hover:bg-lime-600/10 transition-all duration-300 group hover:shadow-lg"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
