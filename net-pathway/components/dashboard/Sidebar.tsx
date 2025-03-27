"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Briefcase,
  Users,
  MessagesSquare,
  Target,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";

// Updated navigation with consistent paths and admin route
const getNavigation = (isAdmin: boolean) => {
  const baseNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Generated Paths", href: "/paths", icon: BookOpen },
    { name: "Assessment", href: "/assessment", icon: Target },
    { name: "Mentorship", href: "/mentorship", icon: Users },
    { name: "Blogs", href: "/blogs", icon: Briefcase },
    { name: "Discussion Board", href: "/discussions", icon: MessagesSquare },
  ];

  // Add admin dashboard link for admin users
  if (isAdmin) {
    baseNavigation.push({
      name: "Admin Dashboard",
      href: "/admin",
      icon: Shield,
    });
  }

  return baseNavigation;
};

interface SidebarProps {
  onCollapse: (collapsed: boolean) => void;
}

export default function Sidebar({ onCollapse }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";

  const navigation = getNavigation(isAdmin);

  useEffect(() => {
    if (onCollapse) {
      onCollapse(isCollapsed);
    }
  }, [isCollapsed, onCollapse]);

  return (
    <motion.aside
      animate={{ width: isCollapsed ? "5rem" : "16rem" }}
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-100 shadow-sm z-30"
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 py-6 px-4">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <motion.div
                  key={item.name}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-sky-50 to-purple-50 text-sky-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 ${
                        isActive
                          ? "text-sky-700"
                          : "text-gray-400 group-hover:text-gray-500"
                      }`}
                    />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>

        {!isCollapsed && (
          <div className="p-4 border-t border-gray-100">
            <div className="bg-gradient-to-r from-sky-50 to-purple-50 p-4 rounded-xl">
              <h3 className="text-sm font-medium text-sky-900">Need Help?</h3>
              <p className="mt-1 text-xs text-gray-600">
                Contact our support team for assistance.
              </p>
              <button className="mt-3 w-full px-3 py-2 text-xs font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
