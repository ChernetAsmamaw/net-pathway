import React from "react";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Linkedin,
  Instagram,
  ArrowRight,
} from "lucide-react";

const Footer = () => {
  const footerSections = {
    services: [
      "Career Assessment",
      "Job Matching",
      "Skills Training",
      "Mentorship",
    ],
    about: ["Our Mission", "Our Team", "Careers", "Contact Us"],
    contact: ["Support", "Feedback", "Join Us"],
  };

  const FooterColumn = ({ title, items }: { title: any; items: any }) => (
    <div>
      <h4 className="font-bold text-lg mb-5 text-gray-800">{title}</h4>
      <ul className="space-y-3">
        {items.map((item: any) => (
          <li key={item}>
            <a
              href="#"
              className="inline-flex items-center text-gray-600 hover:text-sky-600 transition-colors group"
            >
              <span className="group-hover:translate-x-1 transition-transform">
                {item}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="relative bg-gradient-to-b from-white to-sky-50 w-full">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-purple-100/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-sky-100/30 blur-3xl" />
      </div>

      <div className="container mx-auto px-6 py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-10">
          {/* Logo and Contact Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="relative w-48 h-24 mb-6">
              <Image
                src="/logo-large.png"
                alt="Net Pathway Logo"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 196px"
                priority
              />
            </div>
            <div className="space-y-4">
              {[
                { Icon: MapPin, text: "123 Innovation Street, Tech City" },
                { Icon: Phone, text: "+1 (555) 123-4567" },
                { Icon: Mail, text: "contact@netpathway.com" },
              ].map(({ Icon, text }, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 text-gray-600 hover:text-sky-600 transition-colors group"
                >
                  <div className="p-1 rounded-full bg-sky-50 group-hover:bg-sky-100 transition-colors">
                    <Icon size={16} className="text-sky-600" />
                  </div>
                  <span className="text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-3 gap-8 mt-8">
            <FooterColumn title="Services" items={footerSections.services} />
            <FooterColumn title="About Us" items={footerSections.about} />
            <FooterColumn title="Contact Us" items={footerSections.contact} />
          </div>

          {/* Newsletter */}
          <div className="md:col-span-1 mt-6">
            <h4 className="font-bold text-lg mb-5 text-gray-800">
              Stay Connected
            </h4>
            <div className="space-y-5">
              <div className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm"
                />
                <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  Subscribe
                  <ArrowRight size={16} />
                </button>
              </div>
              <div className="flex gap-4">
                {[Facebook, Linkedin, Instagram].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="p-2.5 rounded-full bg-white shadow-sm hover:shadow transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                  >
                    <Icon
                      size={18}
                      className="text-gray-500 hover:text-sky-600"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-10 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Net Pathway. All rights reserved.
            </p>
            <div className="flex gap-6">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (policy) => (
                  <a
                    key={policy}
                    href="#"
                    className="text-sm text-gray-500 hover:text-sky-600 transition-colors"
                  >
                    {policy}
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
