import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/properties", label: "Properties" },
    { href: "#about", label: "About Us" },
    { href: "#services", label: "Services" },
    { href: "#contact", label: "Contact" }
  ];

  const handleNavClick = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-lg" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <Logo />
              <div>
                <h1 className="text-xl font-bold text-gray-800">Anupam Properties</h1>
                <p className="text-sm text-gray-600">Premium Properties</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.href}>
                {item.href.startsWith("#") ? (
                  <button
                    onClick={() => handleNavClick(item.href)}
                    className={`text-gray-700 hover:text-primary transition-colors font-medium ${
                      location === item.href ? "text-primary" : ""
                    }`}
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link href={item.href}>
                    <span
                      className={`text-gray-700 hover:text-primary transition-colors font-medium cursor-pointer ${
                        location === item.href ? "text-primary" : ""
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Contact & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Phone Number */}
            <Button
              onClick={() => window.open("tel:+919911926000")}
              className="phone-link hidden sm:flex"
              size="sm"
            >
              <Phone className="w-4 h-4 mr-2" />
              +91 9911926000
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-6 mt-8">
                  {navItems.map((item) => (
                    <div key={item.href}>
                      {item.href.startsWith("#") ? (
                        <button
                          onClick={() => handleNavClick(item.href)}
                          className="text-lg font-medium text-gray-700 hover:text-primary transition-colors w-full text-left"
                        >
                          {item.label}
                        </button>
                      ) : (
                        <Link href={item.href}>
                          <span className="text-lg font-medium text-gray-700 hover:text-primary transition-colors cursor-pointer">
                            {item.label}
                          </span>
                        </Link>
                      )}
                    </div>
                  ))}
                  
                  <Button
                    onClick={() => window.open("tel:+919911926000")}
                    className="phone-link w-full mt-6"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    +91 9911926000
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
