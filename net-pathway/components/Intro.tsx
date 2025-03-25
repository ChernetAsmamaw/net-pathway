import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

// SVG Components as pure React components (inline) for better performance
const Intro = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const featuresRef = useRef(null);

  // Features with larger inline SVGs (120x120) for the polaroid-style card
  const features = [
    {
      id: "career-assessment",
      title: "Career Assessment",
      description:
        "Discover your ideal career path with our advanced assessment tools that analyze your skills, interests, and values.",
      icon: (
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="20"
            y="15"
            width="80"
            height="90"
            rx="6"
            fill="#EBF8FF"
            stroke="#3182CE"
            strokeWidth="3"
          />
          <path d="M35 35H85" stroke="#3182CE" strokeWidth="3" />
          <path d="M35 60H85" stroke="#3182CE" strokeWidth="3" />
          <path d="M35 85H85" stroke="#3182CE" strokeWidth="3" />
          <circle cx="45" cy="47" r="5" fill="#805AD5" />
          <circle cx="45" cy="72" r="5" fill="#3182CE" />
          <rect x="55" y="44" width="25" height="6" rx="3" fill="#E9D8FD" />
          <rect x="55" y="69" width="25" height="6" rx="3" fill="#BEE3F8" />
        </svg>
      ),
    },
    {
      id: "university-match",
      title: "University Program Matching",
      description:
        "Our AI-powered algorithm connects your unique skillset with in-demand roles across multiple industries.",
      icon: (
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M25 85V45L60 20L95 45V85" stroke="#805AD5" strokeWidth="3" />
          <rect
            x="35"
            y="50"
            width="50"
            height="35"
            rx="3"
            fill="#EBF8FF"
            stroke="#3182CE"
            strokeWidth="2"
          />
          <rect x="45" y="60" width="12" height="20" rx="2" fill="#BEE3F8" />
          <rect x="65" y="60" width="12" height="20" rx="2" fill="#BEE3F8" />
          <path
            d="M20 85H100"
            stroke="#805AD5"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path d="M55 20V10" stroke="#805AD5" strokeWidth="2" />
          <path d="M65 20V10" stroke="#805AD5" strokeWidth="2" />
          <path d="M55 10H65" stroke="#805AD5" strokeWidth="2" />
        </svg>
      ),
    },
    {
      id: "community-resources",
      title: "Community Resources",
      description:
        "Access a blog post and a discussion forum on all things career-related, from resume tips to interview strategies, written by industry experts.",
      icon: (
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="20"
            y="25"
            width="80"
            height="70"
            rx="6"
            fill="#EBF8FF"
            stroke="#3182CE"
            strokeWidth="3"
          />
          <path
            d="M35 50C35 47.7909 36.7909 46 39 46H81C83.2091 46 85 47.7909 85 50V65C85 67.2091 83.2091 69 81 69H39C36.7909 69 35 67.2091 35 65V50Z"
            fill="#BEE3F8"
            stroke="#3182CE"
            strokeWidth="2"
          />
          <circle cx="45" cy="58" r="5" fill="#3182CE" />
          <circle cx="60" cy="58" r="5" fill="#805AD5" />
          <circle cx="75" cy="58" r="5" fill="#3182CE" />
          <path
            d="M35 80H85"
            stroke="#3182CE"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <rect x="30" y="15" width="15" height="15" rx="3" fill="#805AD5" />
          <rect x="75" y="15" width="15" height="15" rx="3" fill="#3182CE" />
        </svg>
      ),
    },
    {
      id: "networking-opportunity",
      title: "Networking Opportunities",
      description:
        "Connect with our network of 500+ like-minded students and professionals to expand your career horizons.",
      icon: (
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="60"
            cy="60"
            r="12"
            fill="#BEE3F8"
            stroke="#3182CE"
            strokeWidth="2.5"
          />
          <circle
            cx="30"
            cy="85"
            r="9"
            fill="#BEE3F8"
            stroke="#3182CE"
            strokeWidth="2.5"
          />
          <circle
            cx="90"
            cy="85"
            r="9"
            fill="#BEE3F8"
            stroke="#3182CE"
            strokeWidth="2.5"
          />
          <circle
            cx="40"
            cy="30"
            r="9"
            fill="#BEE3F8"
            stroke="#3182CE"
            strokeWidth="2.5"
          />
          <circle
            cx="80"
            cy="30"
            r="9"
            fill="#BEE3F8"
            stroke="#3182CE"
            strokeWidth="2.5"
          />
          <path d="M49 45L59 58" stroke="#805AD5" strokeWidth="2.5" />
          <path d="M71 45L61 58" stroke="#805AD5" strokeWidth="2.5" />
          <path d="M45 70L36 77" stroke="#805AD5" strokeWidth="2.5" />
          <path d="M75 70L84 77" stroke="#805AD5" strokeWidth="2.5" />
          <circle cx="60" cy="60" r="6" fill="#805AD5" />
          <circle cx="30" cy="85" r="4.5" fill="#805AD5" />
          <circle cx="90" cy="85" r="4.5" fill="#805AD5" />
          <circle cx="40" cy="30" r="4.5" fill="#805AD5" />
          <circle cx="80" cy="30" r="4.5" fill="#805AD5" />
        </svg>
      ),
    },
    {
      id: "personalized-guidance",
      title: "Personalized Guidance",
      description:
        "Receive customized career advice and roadmaps from experienced professionals in your field of interest.",
      icon: (
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M25 25H95"
            stroke="#3182CE"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M20 40H100"
            stroke="#805AD5"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M25 55H95"
            stroke="#3182CE"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M30 70H90"
            stroke="#805AD5"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M40 85H80"
            stroke="#3182CE"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle
            cx="60"
            cy="100"
            r="10"
            fill="#BEE3F8"
            stroke="#3182CE"
            strokeWidth="2.5"
          />
          <path
            d="M55 95L65 105"
            stroke="#3182CE"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M65 95L55 105"
            stroke="#3182CE"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ];

  // Partner logos simplifying to text elements
  // const partners = [
  //   "ALU",
  //   "ALX",
  //   "Google Developers",
  //   "Mastercard ",
  //   "Google Startups",
  // ];

  // Feature rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="relative bg-white overflow-hidden">
      {/* Background Elements - Simplified for performance */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Background gradient - static for better performance */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-sky-50 via-white to-purple-50" />

        {/* Static decorative elements instead of animated to improve performance */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-sky-100/40 rounded-full filter blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-100/40 rounded-full filter blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-6 lg:px-8 py-16">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Content Area */}
            <motion.div
              className="lg:col-span-7 space-y-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-sky-100 to-purple-100 border border-sky-200/50 shadow-sm">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-700 to-purple-700 font-semibold text-sm">
                  Bridging Education & Opportunity
                </span>
              </div>

              {/* Main Heading */}
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-700 to-purple-700">
                    Net Pathway
                  </span>
                </h1>

                <div className="h-1.5 rounded-full bg-gradient-to-r from-sky-500 to-purple-500 w-24" />

                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                  Your professional guide to creating a successful career for
                  yourself. We help you align your dream career with educational
                  and job opportunities based on real data.
                </p>
              </div>

              {/* Get Started Button */}
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg">
                <Link href="/auth/login">
                  <button className="px-8 py-4 text-lg font-medium rounded-xl bg-gradient-to-r from-sky-600 to-sky-700 text-white shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1">
                    Get Started
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Right Content Area - Polaroid-style Feature Card with Larger SVG Icons */}
            <motion.div
              className="lg:col-span-5 relative hidden lg:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div
                className="relative z-10 bg-white border-8 border-white p-6 rounded-md shadow-xl hover:shadow-2xl transition-all duration-500"
                style={{
                  boxShadow:
                    "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* Polaroid-style pin */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-sky-500 to-purple-500 rounded-full p-3 text-white shadow-lg transform rotate-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>

                {/* Polaroid-style top label */}
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white px-4 py-1 rounded-t-lg shadow-sm text-sm font-medium text-gray-500 border border-gray-100">
                  Net Pathway
                </div>

                {/* Icon display area with Polaroid-style background */}
                <div
                  className="mb-8 bg-gradient-to-br from-sky-50 to-purple-50 p-6 rounded-md flex items-center justify-center"
                  style={{ minHeight: "200px" }}
                >
                  <motion.div
                    key={activeFeature}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-center transform hover:scale-105 transition-transform"
                  >
                    {/* Render larger 120x120 icons */}
                    <div className="w-32 h-32">
                      {features[activeFeature].icon}
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  key={`title-${activeFeature}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="px-2"
                >
                  <h3 className="text-xl font-bold mb-2 text-gray-800">
                    {features[activeFeature].title}
                  </h3>
                  <p className="text-gray-600">
                    {features[activeFeature].description}
                  </p>
                </motion.div>

                <div className="mt-6 flex justify-center space-x-3">
                  {features.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveFeature(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === activeFeature ? "bg-sky-500" : "bg-gray-200"
                      } hover:bg-sky-300`}
                      aria-label={`View ${features[index].title}`}
                    />
                  ))}
                </div>
              </div>

              {/* Polaroid-style decorative elements */}
              <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-purple-100 rounded-md rotate-12 z-0 border-4 border-white shadow-sm" />
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-sky-100 rounded-md -rotate-12 z-0 border-4 border-white shadow-sm" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section - Optimized for performance */}
      <section className="py-20 px-6 lg:px-8 bg-white/80" ref={featuresRef}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              How Net Pathway{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-purple-600">
                Transforms
              </span>{" "}
              Your Career Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform addresses common challenges in career
              guidance and educational pathways
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="mb-6 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section - Simplified */}
      {/* <section className="py-16 px-6 lg:px-8 bg-gradient-to-r from-sky-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Trusted by Education Leaders
            </h2>
            <p className="text-gray-600">
              Join thousands of students finding their perfect career path
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-6 py-6">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="text-xl font-bold text-gray-400 transform hover:scale-105 transition-transform"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Call to Action Section */}
      <section className="py-20 px-6 lg:px-8 bg-white relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Ready to Start Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-purple-600">
              Career Journey
            </span>
            ?
          </h2>

          <p className="text-xl text-gray-600 mb-10">
            Join thousands of students who have found their perfect educational
            and career path with Net Pathway
          </p>

          <div>
            <Link href="/auth/register">
              <button className="px-8 py-4 text-lg font-medium rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg hover:shadow-xl hover:from-sky-600 hover:to-sky-700 transition-all duration-300">
                Create Free Account
              </button>
            </Link>
            <Link href="/about">
              <button className="ml-4 px-8 py-4 text-lg font-medium rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300">
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Intro;
