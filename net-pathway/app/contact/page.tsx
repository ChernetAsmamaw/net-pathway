"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";

export default function ContactPage() {
  const contactMethods = [
    {
      title: "Email Us",
      description: "Get in touch with our dedicated support team",
      icon: Mail,
      info: "support@netpathway.com",
    },
    {
      title: "Call Us",
      description: "Speak directly with our career advisors",
      icon: Phone,
      info: "+250 123 456 789",
    },
    {
      title: "Visit Us",
      description: "Come to our office for a personal consultation",
      icon: MapPin,
      info: "Kigali, Rwanda",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow pt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h1 className="text-5xl font-bold text-sky-700 mb-6">Contact Us</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Have questions about your career path? We're here to help guide
              you towards your future.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid md:grid-cols-3 gap-10 mb-24">
            {contactMethods.map((method, index) => (
              <div
                key={method.title}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="p-4 rounded-full bg-sky-100">
                    <method.icon className="w-10 h-10 text-sky-700" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                      {method.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{method.description}</p>
                    <p className="text-sky-700 font-medium">{method.info}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form Section */}
          <div className="bg-white rounded-2xl shadow-md py-16 mb-24">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Send Us a Message
              </h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:ring-0"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:ring-0"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:ring-0"
                    placeholder="How can we help you?"
                  />
                </div>
                <div className="text-center">
                  <button className="px-8 py-4 bg-sky-700 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-lg inline-flex items-center">
                    Send Message
                    <ArrowRight className="ml-2" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
