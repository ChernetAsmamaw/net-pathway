import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const navigationItems = [
  {
    title: "Services",
    href: "/services",
  },
  {
    title: "About",
    href: "/about",
  },
  {
    title: "Contact",
    href: "/contact",
  },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      setIsMobileMenuOpen(false);
    };
  }, [scrolled]);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-lg py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="mx-auto px-6 sm:px-20">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-[140px] h-[46px]"
            >
              <Image
                src="/logo-large.png"
                alt="Net Pathways Logo"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </Link>

          <nav className="hidden md:flex items-center space-x-10">
            {navigationItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="text-gray-700 font-medium hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-sky-600 hover:to-purple-600 transition-all duration-300"
              >
                {item.title}
              </Link>
            ))}
            <Link
              href="/auth/login"
              className="block px-6 py-2 text-sm font-medium text-white bg-sky-700 rounded-lg hover:bg-purple-700"
            >
              Sign In
            </Link>
          </nav>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 md:hidden text-gray-700"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden bg-white/95 backdrop-blur-sm mt-4 rounded-xl shadow-lg"
            >
              <div className="py-4 px-2 space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="block px-4 py-3 text-gray-700 font-medium hover:bg-gradient-to-r hover:from-sky-50 hover:to-purple-50 rounded-lg transition-colors"
                  >
                    {item.title}
                  </Link>
                ))}
                <Link
                  href="/auth/login"
                  className="block px-6 py-2 text-sm font-medium text-white bg-sky-700 rounded-lg hover:bg-purple-700"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
