import React from "react";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";

const Footer = () => {
  const footerSections = {
    services: [
      "Career Assessment",
      "Job Matching",
      "Skills Training",
      "Mentorship",
    ],
    resources: [
      "Learning Paths",
      "Industry Insights",
      "Success Stories",
      "Blog",
    ],
    about: ["Our Mission", "Our Team", "Careers", "Contact Us"],
    contact: ["Support", "Feedback", "Join Us"],
  };

  interface FooterColumnProps {
    title: string;
    items: string[];
  }

  const FooterColumn: React.FC<FooterColumnProps> = ({ title, items }) => (
    <div>
      <h4 className="font-bold text-lg mb-4">{title}</h4>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item}>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="bg-gray-50 text-gray-800 w-full fixed bottom-0 shadow-lg">
      <div className="container mx-auto px-4 py-6 max-h-[90vh] overflow-y-auto">
        <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-7 gap-8">
          {/* Logo and Info Section */}
          <div className="col-span-2">
            <div className="relative w-48 h-24 mb-4">
              <Image
                src="/logo-large.png"
                alt="Net Pathway Logo"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 192px"
                priority
              />
            </div>
            <div className="space-y-2">
              {[
                { Icon: MapPin, text: "123 Innovation Street, Tech City" },
                { Icon: Phone, text: "+1 (555) 123-4567" },
                { Icon: Mail, text: "contact@netpathway.com" },
              ].map(({ Icon, text }, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Icon size={16} />
                  <span className="text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          <FooterColumn title="Services" items={footerSections.services} />
          <FooterColumn title="Resources" items={footerSections.resources} />
          <FooterColumn title="About Us" items={footerSections.about} />
          <FooterColumn title="Contact Us" items={footerSections.contact} />

          {/* Newsletter Section */}
          <div className="col-span-4 md:col-span-1">
            <h4 className="font-bold text-lg mb-4">Stay Connected</h4>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-sky-700 text-white px-3 py-2 rounded-md text-sm hover:bg-purple-700">
                  Subscribe
                </button>
              </div>
              <div className="flex gap-4">
                {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                  <Icon
                    key={i}
                    className="w-5 h-5 cursor-pointer hover:text-blue-600"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Net Pathway. All rights reserved.
            </p>
            <div className="flex gap-4">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (policy) => (
                  <a
                    key={policy}
                    href="#"
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
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
