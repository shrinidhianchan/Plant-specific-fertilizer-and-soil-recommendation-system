import { Link } from "react-router-dom";
import { Menu, X, Leaf } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/login", label: "Login" },
    { href: "/signup", label: "Sign Up" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-transparent backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group animate-fade-in hover:opacity-80 transition-opacity duration-300"
          >
            <div className="relative">
              <div className="p-2.5 bg-gradient-to-br from-forest-green to-fresh-green rounded-xl group-hover:shadow-lg transition-all duration-300 group-hover:scale-110 transform">
                <Leaf className="w-6 h-6 text-yellow-50" strokeWidth={2.5} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-golden-yellow rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col -gap-1">
              <span className="font-extrabold text-yellow-100">
                AGRISENSE
              </span>
              <span className="text-xs text-amber-800 font-semibold tracking-widest -mt-1">
                SOIL EXPERT
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden text-white md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-foreground hover:text-white transition-all duration-300 font-semibold text-sm hover:underline hover:underline-offset-4"
                style={{
                  animation: `slideInRight 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white p-2 hover:bg-secondary/20 rounded-lg transition-all duration-300"
          >
            {isOpen ? (
              <X className="w-6 h-6 animate-fade-in" />
            ) : (
              <Menu className="w-6 h-6 animate-fade-in" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-2 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="block px-4 py-2 text-foreground hover:bg-white rounded-lg transition-all duration-300 font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
