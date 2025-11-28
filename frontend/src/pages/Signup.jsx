import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Leaf } from "lucide-react";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    location: "",
    farmSize: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!agreeToTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Signup attempt:", formData);
    } finally {
      setIsLoading(false);
    }
  };

  const inputDelay = (index) => `${(index + 1) * 0.08}s`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-golden-yellow/20 via-background to-background flex items-center justify-center py-12 px-4 bg-lime-200 text-lime-950">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-8 group hover:scale-105 transition-transform duration-300"
          >
            <div className="p-3 bg-forest-green/10 group-hover:bg-forest-green/20 transition-colors duration-300 rounded-lg">
              <Leaf className="w-8 h-8 text-forest-green" />
            </div>
            <span className="font-bold text-2xl text-forest-green">AgriSense</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground animate-slide-in-left">
            Join AgriSense
          </h1>
          <p className="text-muted-foreground mt-2 animate-slide-in-right">
            Start your journey to smarter farming
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl p-8 border border-border shadow-lg hover:shadow-xl transition-shadow duration-300 space-y-5">
            {/* Full Name */}
            <div className="space-y-2 animate-fade-in" style={{ animationDelay: inputDelay(0) }}>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-foreground"
              >
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-forest-green/50 focus:border-transparent transition-all duration-300"
                placeholder="John Farmer"
              />
            </div>

            {/* Email */}
            <div className="space-y-2 animate-fade-in" style={{ animationDelay: inputDelay(1) }}>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-forest-green/50 focus:border-transparent transition-all duration-300"
                placeholder="john@example.com"
              />
            </div>

            {/* Location */}
            <div className="space-y-2 animate-fade-in" style={{ animationDelay: inputDelay(2) }}>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-foreground"
              >
                Location / State
              </label>
              <input
                id="location"
                name="location"
                type="text"
                required
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-forest-green/50 focus:border-transparent transition-all duration-300"
                placeholder="e.g., Maharashtra"
              />
            </div>

            {/* Farm Size */}
            <div className="space-y-2 animate-fade-in" style={{ animationDelay: inputDelay(3) }}>
              <label
                htmlFor="farmSize"
                className="block text-sm font-medium text-foreground"
              >
                Farm Size (Hectares)
              </label>
              <select
                id="farmSize"
                name="farmSize"
                required
                value={formData.farmSize}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-forest-green/50 focus:border-transparent transition-all duration-300"
              >
                <option value="">Select farm size</option>
                <option value="small">0-5 hectares</option>
                <option value="medium">5-20 hectares</option>
                <option value="large">20-50 hectares</option>
                <option value="xlarge">50+ hectares</option>
              </select>
            </div>

            {/* Password */}
            <div className="space-y-2 animate-fade-in" style={{ animationDelay: inputDelay(4) }}>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-forest-green/50 focus:border-transparent transition-all duration-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2 animate-fade-in" style={{ animationDelay: inputDelay(5) }}>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-foreground"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-forest-green/50 focus:border-transparent transition-all duration-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: inputDelay(6) }}>
              <input
                id="terms"
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="w-4 h-4 rounded border-border accent-forest-green mt-1"
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the{" "}
                <a href="#" className="text-forest-green hover:text-forest-green/90 font-medium transition-colors duration-300">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-forest-green hover:text-forest-green/90 font-medium transition-colors duration-300">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-forest-green text-white font-semibold rounded-lg hover:bg-forest-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 mt-6 hover:shadow-lg animate-fade-in"
              style={{ animationDelay: inputDelay(7) }}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          {/* Login Link */}
          <p className="text-center text-foreground animate-fade-in" style={{ animationDelay: inputDelay(8) }}>
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-forest-green hover:text-forest-green/90 font-semibold transition-colors duration-300"
            >
              Sign in here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
