"use client";

import React from "react";
import {
  Briefcase,
  BookOpen,
  Target,
  Users,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ServicesPage() {
  const mainServices = [
    {
      title: "Career Assessment",
      description:
        "Discover your ideal career path through our AI-powered assessment tools",
      icon: Target,
      features: [
        "Personality and aptitude analysis",
        "Skills gap identification",
        "Industry compatibility matching",
        "Personalized career roadmap",
      ],
    },
    {
      title: "Job Matching",
      description:
        "Connect with opportunities that perfectly align with your profile",
      icon: Briefcase,
      features: [
        "Real-time job market analysis",
        "Automated application tracking",
        "Interview preparation support",
        "Salary insights and negotiation tips",
      ],
    },
    {
      title: "Skills Training",
      description:
        "Access curated learning paths tailored to your career goals",
      icon: BookOpen,
      features: [
        "Industry-certified courses",
        "Hands-on project experience",
        "Expert-led workshops",
        "Progress tracking and assessments",
      ],
    },
    {
      title: "Mentorship",
      description:
        "Learn from industry professionals who guide your career journey",
      icon: Users,
      features: [
        "One-on-one mentoring sessions",
        "Industry expert network",
        "Career guidance workshops",
        "Networking opportunities",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow pt-12">
        {/* Hero Section */}
        <div className="bg-white pt-20 pb-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-sky-700 mb-6">
                Empowering Your Career Journey
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Discover comprehensive career development services designed to
                help you succeed in today's competitive job market.
              </p>
              <button className="px-8 py-4 bg-sky-700 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-lg">
                Get Started Today
              </button>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {mainServices.map((service) => (
              <div
                key={service.title}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-sky-50 p-3 rounded-xl">
                    <service.icon className="w-8 h-8 text-sky-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold mb-3">
                      {service.title}
                    </h2>
                    <p className="text-gray-600 mb-6">{service.description}</p>
                    <ul className="space-y-3">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-sky-700" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button className="mt-6 flex items-center gap-2 text-sky-700 hover:text-purple-700 font-medium">
                      Learn more <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* 
        <div className="bg-sky-700 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Take the Next Step?
            </h2>
            <p className="text-sky-100 mb-8 max-w-2xl mx-auto">
              Join thousands of successful professionals who have transformed
              their careers with Net Pathway.
            </p>
            <button className="px-8 py-4 bg-white text-sky-700 rounded-xl hover:bg-purple-700 hover:text-white transition-colors shadow-lg">
              Schedule a Consultation
            </button>
          </div>
        </div> */}
      </main>

      <Footer />
    </div>
  );
}
