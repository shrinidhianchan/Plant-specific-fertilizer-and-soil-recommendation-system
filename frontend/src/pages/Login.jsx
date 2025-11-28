import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Leaf } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Login attempt:", formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-golden-yellow/20 bg-lime-300 via-background to-background flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md animate-fade-in text-lime-950">
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
            Welcome Back
          </h1>
          <p className="text-muted-foreground mt-2 animate-slide-in-right">
            Sign in to your AgriSense account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl p-8 border border-border shadow-lg hover:shadow-xl transition-shadow duration-300 space-y-6">
            {/* Email Input */}
            <div className="space-y-2 animate-fade-in">
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
                placeholder="you@example.com"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2 animate-fade-in" style={{ animationDelay: "0.1s" }}>
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

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <label className="flex items-center gap-2 cursor-pointer hover:text-forest-green transition-colors duration-300">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border accent-forest-green"
                />
                <span className="text-foreground">Remember me</span>
              </label>
              <a
                href="#"
                className="text-forest-green hover:text-forest-green/90 font-medium transition-colors duration-300"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-forest-green text-white font-semibold rounded-lg hover:bg-forest-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-foreground animate-fade-in" style={{ animationDelay: "0.4s" }}>
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-forest-green hover:text-forest-green/90 font-semibold transition-colors duration-300"
            >
              Sign up here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
