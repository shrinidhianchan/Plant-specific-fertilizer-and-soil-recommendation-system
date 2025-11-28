import { Link } from "react-router-dom";
import { Leaf, Droplets, Sprout, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="relative text-white py-0 px-4 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://cdn.builder.io/api/v1/image/assets%2F8850bf8b823c4ea4a6f504b532f33e33%2Fbdaa6d872c314b2b83e6073a40f12393?format=webp&width=800')",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-20">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
              Smart Farming, Better Yields
            </h1>
            <p className="text-xl text-white mb-8 drop-shadow-md font-medium">
              AI-powered soil analysis and fertilizer recommendations for
              sustainable agriculture. Get personalized guidance based on your
              soil conditions and crop needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/analyze"
                className="px-8 py-4 bg-agri-gold text-agri-dark font-bold rounded-lg hover:bg-opacity-90 transition-colors text-center shadow-lg"
              >
                Analyze Soil Now
              </Link>
              <Link
                to="/about"
                className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors text-center"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-w">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-lime-950 text-center mb-12">
            Why Choose AgriSense?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-lime-950">
            <div className="p-6 bg-agri-light bg-opacity-20 rounded-lg border-l-4 border-agri-gold">
              <Droplets className="w-12 h-12 text-lime-950 mb-4" />
              <h3 className="text-xl font-bold text-agri-dark mb-2 text-lime-950">
                Soil Analysis
              </h3>
              <p className="text-agri-sage">
                AI-powered image recognition to detect soil type, pH levels, and nutrient content
              </p>
            </div>

            <div className="p-6 bg-agri-light bg-opacity-20 rounded-lg border-l-4 border-agri-gold">
              <Sprout className="w-12 h-12 text-agri-sage mb-4" />
              <h3 className="text-xl font-bold text-agri-dark mb-2">
                Smart Recommendations
              </h3>
              <p className="text-agri-sage">
                Plant-specific fertilizer recommendations tailored to your soil conditions
              </p>
            </div>

            <div className="p-6 bg-agri-light bg-opacity-20 rounded-lg border-l-4 border-agri-gold">
              <Zap className="w-12 h-12 text-agri-sage mb-4" />
              <h3 className="text-xl font-bold text-agri-dark mb-2">
                Cost Efficient
              </h3>
              <p className="text-agri-sage">
                Optimize fertilizer usage to reduce costs and increase crop productivity
              </p>
            </div>

            <div className="p-6 bg-agri-light bg-opacity-20 rounded-lg border-l-4 border-agri-gold">
              <Leaf className="w-12 h-12 text-agri-sage mb-4" />
              <h3 className="text-xl font-bold text-agri-dark mb-2">
                Sustainable
              </h3>
              <p className="text-agri-sage">
                Protect soil health and environment through data-driven farming practices
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-agri-dark text-white">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-agri-gold text-agri-dark rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-3">Take a Photo</h3>
              <p className="text-agri-light">
                Capture a clear image of your soil or upload from your device
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-agri-gold text-agri-dark rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-3">Get Analysis</h3>
              <p className="text-agri-light">
                Our AI analyzes soil properties and nutrient levels instantly
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-agri-gold text-agri-dark rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-3">Get Recommendations</h3>
              <p className="text-agri-light">
                Receive personalized fertilizer and care recommendations
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white bg-opacity-30">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl text-black font-bold mb-6">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-lg text-agri-sage mb-8 max-w-2xl mx-auto">
            Start analyzing your soil today and get expert recommendations for
            better crop yields and sustainable farming practices.
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-white text-lime-950 font-bold rounded-lg hover:bg-agri-light transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}
