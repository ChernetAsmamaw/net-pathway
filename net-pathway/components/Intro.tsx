import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const Intro = () => {
  const [email, setEmail] = useState("");
  const [partners, setPartners] = useState([]);
  const [activeFeature, setActiveFeature] = useState(0);
  const featuresRef = useRef(null);

  // Features content
  const features = [
    {
      icon: "🎯",
      title: "Career Assessment",
      description:
        "Discover your ideal career path with our advanced assessment tools that analyze your skills, interests, and values.",
    },
    {
      icon: "🔍",
      title: "Skill-Job Matching",
      description:
        "Our AI-powered algorithm connects your unique skillset with in-demand roles across multiple industries.",
    },
    {
      icon: "📚",
      title: "Educational Resources",
      description:
        "Access a comprehensive database of courses, certifications, and learning paths tailored to your career goals.",
    },
    {
      icon: "🤝",
      title: "Industry Partnerships",
      description:
        "Connect with our network of 500+ industry partners offering internships, mentorships, and job opportunities.",
    },
    {
      icon: "🧭",
      title: "Personalized Guidance",
      description:
        "Receive customized career advice and roadmaps from experienced professionals in your field of interest.",
    },
  ];

  // Success stories
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer at TechCorp",
      image: "/api/placeholder/64/64",
      quote:
        "Net Pathways helped me discover my passion for coding and connected me with mentors who guided my journey. Now I'm working at my dream company!",
    },
    {
      name: "Michael Chen",
      role: "Data Analyst at FinanceGlobal",
      image: "/api/placeholder/64/64",
      quote:
        "The skill assessment tool accurately identified my strengths in data analysis. Within 3 months, I secured an internship that turned into a full-time role.",
    },
    {
      name: "Priya Sharma",
      role: "UX Designer at CreativeStudio",
      image: "/api/placeholder/64/64",
      quote:
        "Net Pathways' educational resources helped me transition from graphic design to UX. Their industry connections were invaluable for building my portfolio.",
    },
  ];

  // Partner logos setup
  useEffect(() => {
    const partnerCards = [
      "Google",
      "Microsoft",
      "Amazon",
      "IBM",
      "Adobe",
      "Salesforce",
      "Oracle",
      "Deloitte",
    ];
    setPartners([...partnerCards, ...partnerCards]);

    const movePartners = () => {
      setPartners((prev) => {
        const firstPartner = prev[0];
        const newPartners = prev.slice(1);
        return [...newPartners, firstPartner];
      });
    };

    const interval = setInterval(movePartners, 3000);
    return () => clearInterval(interval);
  }, []);

  // Feature rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="relative bg-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Modern Gradient Background */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-sky-50 via-white to-purple-50" />

        {/* Decorative Blobs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-sky-100/40 rounded-full filter blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-100/40 rounded-full filter blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-sky-200/30 rounded-full filter blur-3xl" />

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/subtle-grid.png')] opacity-5" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-6 lg:px-8 py-20">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left Content Area */}
            <motion.div
              className="lg:col-span-7 space-y-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-sky-100 to-purple-100 border border-sky-200/50 shadow-sm"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-700 to-purple-700 font-semibold text-sm">
                  Bridging Education & Opportunity
                </span>
              </motion.div>

              {/* Main Heading */}
              <div className="space-y-6">
                <h1 className="text-7xl font-bold tracking-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-700 to-purple-700">
                    Net Pathways
                  </span>
                </h1>

                <motion.div
                  className="h-1.5 rounded-full bg-gradient-to-r from-sky-500 to-purple-500 w-24"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 96, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                />

                <p className="text-2xl text-gray-600 leading-relaxed max-w-2xl">
                  Your professional guide to creating a successful career for
                  yourself. We are here to help you align you dream career with
                  educational and job opportunities all based on data.
                </p>
              </div>

              {/* Email Signup */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <a
                  href="/auth/login"
                  className="px-8 py-4 text-lg font-medium rounded-xl bg-gradient-to-r from-sky-600 to-sky-700 text-white shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Get Started
                </a>
              </motion.div>
            </motion.div>

            {/* Right Content Area - Animated Feature Card */}
            <motion.div
              className="lg:col-span-5 relative hidden lg:block"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <div className="relative z-10 bg-white border border-gray-100 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500">
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-sky-500 to-purple-500 rounded-full p-3 text-white">
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

                <div className="mb-6 h-48 rounded-xl bg-gradient-to-br from-sky-50 to-purple-50 flex items-center justify-center">
                  <motion.span
                    key={activeFeature}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-6xl"
                  >
                    {features[activeFeature].icon}
                  </motion.span>
                </div>

                <motion.div
                  key={`title-${activeFeature}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-xl font-bold mb-2 text-gray-800">
                    {features[activeFeature].title}
                  </h3>
                  <p className="text-gray-600">
                    {features[activeFeature].description}
                  </p>
                </motion.div>

                <div className="mt-6 flex justify-center space-x-2">
                  {features.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveFeature(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === activeFeature ? "bg-sky-500" : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-purple-100 rounded-lg rotate-12 z-0" />
              <div className="absolute -top-6 -right-10 w-32 h-32 bg-sky-100 rounded-lg -rotate-12 z-0" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="pt-10 py-24 px-6 lg:px-8 bg-white/70 backdrop-blur-sm"
        ref={featuresRef}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl font-bold text-gray-800 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              How Net Pathways{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-purple-600">
                Transforms
              </span>{" "}
              Your Career Journey
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              Our comprehensive platform addresses common challenges in career
              guidance and educational pathways
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-2"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Intro;
