import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-golden-yellow/20 to-background flex items-center justify-center px-4 animate-fade-in bg-lime-950 text-white">
      <div className="text-center max-w-md">
        <div className="p-4 bg-destructive/10 rounded-full w-fit mx-auto mb-6 animate-bounce">
          <AlertCircle className="w-12 h-12 text-destructive" />
        </div>
        <h1 className="text-5xl font-bold text-foreground mb-3 animate-slide-in-left">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-foreground mb-4 animate-slide-in-right">
          Page Not Found
        </h2>
        <p className="text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          Oops! It looks like the page you're looking for doesn't exist. Let's
          get you back to farming!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <Link
            to="/"
            className="px-6 py-3 bg-forest-green text-white font-semibold rounded-lg hover:bg-forest-green/90 transition-all duration-300 hover:shadow-lg"
          >
            Return to Home
          </Link>
          <Link
            to="/analyze"
            className="px-6 py-3 border-2 border-forest-green text-forest-green font-semibold rounded-lg hover:bg-forest-green/5 transition-all duration-300"
          >
            Analyze Soil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
