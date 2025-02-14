import React, { useState } from "react";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import Link from "next/link";

// Navigation structure with links and metadata
const navigationConfig = [
  {
    title: "Services",
    submenu: [
      {
        label: "Career Assessment",
        description: "Evaluate your skills and career path",
        href: "/services/career-assessment",
        icon: "📊",
      },
      {
        label: "Job Matching",
        description: "Find the perfect job opportunities",
        href: "/services/job-matching",
        icon: "🎯",
      },
      {
        label: "Skills Training",
        description: "Enhance your professional skills",
        href: "/services/skills-training",
        icon: "📚",
      },
    ],
  },
  {
    title: "Resources",
    submenu: [
      {
        label: "Learning Paths",
        description: "Structured learning programs",
        href: "/resources/learning-paths",
        icon: "🛣️",
      },
      {
        label: "Industry Insights",
        description: "Latest trends and analysis",
        href: "/resources/insights",
        icon: "💡",
      },
      {
        label: "Success Stories",
        description: "Real stories from our community",
        href: "/resources/success-stories",
        icon: "🌟",
      },
    ],
  },
  {
    title: "About",
    submenu: [
      {
        label: "Our Mission",
        description: "What drives us forward",
        href: "/about/mission",
        icon: "🎯",
      },
      {
        label: "Team",
        description: "Meet our dedicated team",
        href: "/about/team",
        icon: "👥",
      },
      {
        label: "Partners",
        description: "Our valued partnerships",
        href: "/about/partners",
        icon: "🤝",
      },
    ],
  },
  {
    title: "Contact",
    submenu: [
      {
        label: "Support",
        description: "Get help and support",
        href: "/contact/support",
        icon: "💬",
      },
      {
        label: "Feedback",
        description: "Share your thoughts",
        href: "/contact/feedback",
        icon: "📝",
      },
      {
        label: "Join Us",
        description: "Become part of our team",
        href: "/contact/careers",
        icon: "🚀",
      },
    ],
  },
];

interface DesktopMenuItemProps {
  item: {
    title: string;
    submenu: {
      label: string;
      description: string;
      href: string;
      icon: string;
    }[];
  };
}

interface MobileMenuItemProps {
  item: {
    title: string;
    submenu: {
      label: string;
      description: string;
      href: string;
      icon: string;
    }[];
  };
  isOpen: boolean;
  toggleOpen: () => void;
}

const DesktopMenuItem = ({ item }: DesktopMenuItemProps) => (
  <NavigationMenuItem>
    <NavigationMenuTrigger className="bg-transparent hover:bg-slate-100">
      {item.title}
    </NavigationMenuTrigger>
    <NavigationMenuContent>
      <ul className="w-[280px] p-4 md:w-[340px] space-y-3">
        {item.submenu.map((subItem) => (
          <li key={subItem.label}>
            <Link href={subItem.href} legacyBehavior passHref>
              <NavigationMenuLink className="block hover:bg-slate-100 rounded-lg p-3 transition-colors">
                <div className="flex items-start gap-3">
                  <span className="text-xl">{subItem.icon}</span>
                  <div>
                    <div className="font-medium mb-1">{subItem.label}</div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {subItem.description}
                    </p>
                  </div>
                </div>
              </NavigationMenuLink>
            </Link>
          </li>
        ))}
      </ul>
    </NavigationMenuContent>
  </NavigationMenuItem>
);

const MobileMenuItem = ({ item, isOpen, toggleOpen }: MobileMenuItemProps) => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  return (
    <div className="mb-2">
      <button
        onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
        className="flex items-center w-full px-4 py-2 text-left font-medium hover:bg-slate-100 rounded-lg transition-colors"
      >
        {item.title}
        <ChevronRight
          className={`ml-auto h-4 w-4 transition-transform duration-200 ${
            isSubmenuOpen ? "rotate-90" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {isSubmenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="py-2 space-y-1">
              {item.submenu.map((subItem) => (
                <Link
                  key={subItem.label}
                  href={subItem.href}
                  className="flex items-center gap-3 px-6 py-2 text-sm text-gray-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <span>{subItem.icon}</span>
                  <div>
                    <div className="font-medium">{subItem.label}</div>
                    <p className="text-xs text-gray-500">
                      {subItem.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed w-full z-50 bg-white shadow-md">
      <div className="mx-auto px-4 sm:px-10">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-[120px] h-[40px]"
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

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                {navigationConfig.map((item) => (
                  <DesktopMenuItem key={item.title} item={item} />
                ))}
              </NavigationMenuList>{" "}
              {/* Signin Button */}
              <div className="ml-6 md:ml-8">
                <button className="block px-6 py-2 text-sm font-medium text-white bg-sky-700 rounded-lg hover:bg-purple-700">
                  Sign In
                </button>
              </div>
            </NavigationMenu>
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 md:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden bg-white"
            >
              <div className="py-4">
                {navigationConfig.map((item) => (
                  <MobileMenuItem
                    key={item.title}
                    item={item}
                    isOpen={isMobileMenuOpen}
                    toggleOpen={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  />
                ))}
                {/* Signin Button */}
                <div className="ml-3">
                  <button className="block px-6 py-2 text-sm font-medium text-white bg-sky-700 rounded-lg hover:bg-purple-700">
                    Sign In
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
