"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Lightbulb,
  Target,
  Eye,
  Users,
  ArrowRight,
  ChevronsUp,
  Code,
  Brain,
} from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  const coreSections = [
    {
      title: "The Inspiration",
      description:
        "Born from the recognition that many talented youth struggle to find their ideal career. We saw the need to bridges the gap between education and industry requirements.",
      icon: Lightbulb,
    },
    {
      title: "Our Mission",
      description:
        "To empower individuals with the knowledge, tools, mentorship, and guidance they need to make informed career decisions in the ever-evolving industry in a personalised way.",
      icon: Target,
    },
    {
      title: "Our Vision",
      description:
        "To become the leading platform that transforms how youth navigate their careers, making professional growth accessible and achievable for anyone striving to build a career.",
      icon: Eye,
    },
  ];

  const valuesData = [
    {
      title: "Accessibility",
      description:
        "We believe career guidance should be available to everyone, regardless of background or experience level.",
      icon: Users,
    },
    {
      title: "Innovation",
      description:
        "We constantly evolve our platform to reflect the changing demands of the industry.",
      icon: Code,
    },
    {
      title: "Personalization",
      description:
        "We recognize that every career journey is unique and tailor our guidance to individual needs and goals.",
      icon: Brain,
    },
    {
      title: "Growth",
      description:
        "We are committed to helping you achieve continuous professional development and career advancement.",
      icon: ChevronsUp,
    },
  ];

  const milestones = [
    { year: "2025", event: "Net Pathway founded" },
    // { year: "2021", event: "Launched first personalized career mapping tool" },
    // {
    //   year: "2022",
    //   event: "Partnered with 50+ tech companies for job placement",
    // },
    // { year: "2023", event: "Expanded services to include mentorship programs" },
    // {
    //   year: "2024",
    //   event: "Reached milestone of helping 10,000+ professionals",
    // },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h1 className="text-5xl font-bold text-sky-700 mb-6">Our Story</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Building bridges between talent and opportunity in the industry
            </p>
          </div>

          {/* Core Values Section */}
          <div className="grid md:grid-cols-3 gap-10 mb-24">
            {coreSections.map((section, index) => (
              <div
                key={section.title}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="p-4 rounded-full bg-sky-100">
                    <section.icon className="w-10 h-10 text-sky-700" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {section.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {section.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Our Journey Section */}
          <div className="bg-white rounded-2xl shadow-md p-12 mb-24">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Our Journey
            </h2>
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="flex-1 space-y-6">
                <p className="text-gray-600 leading-relaxed mb-4">
                  Net Pathway was born from a vision to help students make
                  informed decisions about their future careers. We recognized
                  the challenge many youth face when choosing their university
                  degrees and career paths.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Our innovative approach combines personality assessments,
                  interest mapping, and real-world insights to help students
                  discover degree programs and career paths that truly align
                  with their passions and strengths. We work closely with
                  universities, industry professionals, and career counselors to
                  provide comprehensive guidance that bridges the gap between
                  high school and higher education.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  By focusing on early career guidance, we aim to help students
                  make confident decisions about their future, reducing the
                  uncertainty and stress often associated with choosing a career
                  path. Our platform serves as a compass, guiding young minds
                  toward fulfilling educational and professional journeys that
                  match their interests and potential.
                </p>
              </div>
              <div className="flex-1">
                <div className="bg-sky-50 rounded-xl p-8">
                  <h3 className="text-2xl font-semibold text-sky-700 mb-6">
                    Key Milestone
                  </h3>
                  <ul className="space-y-6">
                    <li className="flex items-start gap-4">
                      <span className="font-bold text-sky-700 min-w-[4rem]">
                        2025
                      </span>
                      <span className="text-gray-700">
                        Launch of Net Pathway's Career Discovery Platform for
                        High School Students
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Person Behind Section */}
          <div className="mb-24">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Founder
            </h2>
            <div className="flex justify-center">
              <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow max-w-3xl">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-48 h-48 relative">
                    <Image
                      src="/me.jpg"
                      alt="Chernet"
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold text-gray-900">
                      Chernet Asmamaw
                    </h3>
                    <p className="text-sky-700 font-medium">
                      Software Engineering Student at ALU
                    </p>
                  </div>
                  <p className="text-gray-600 leading-relaxed max-w-2xl">
                    Net Pathway represents my capstone project for my final term
                    at the African Leadership University in Kigali, Rwanda. As a
                    passionate software engineering student, I created this
                    platform to address the challenges many face when navigating
                    their careers. This project combines my technical skills
                    with my desire to make career guidance more accessible to
                    everyone.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-24">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Our Values
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {valuesData.map((value, index) => (
                <div
                  key={value.title}
                  className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 rounded-full bg-sky-100">
                      <value.icon className="w-8 h-8 text-sky-700" />
                    </div>
                    <h3 className="text-xl font-semibold">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-sky-700 to-sky-600 text-white rounded-2xl p-12 text-center max-w-4xl mx-auto mb-20">
            <h2 className="text-3xl font-bold mb-6">Join Our Journey</h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Be part of a community that's reshaping the future careers.
              Whether you're just starting out or looking to advance to the next
              level, we're here to help you build your success story.
            </p>
            <button className="group px-8 py-4 bg-white text-sky-700 rounded-xl hover:bg-sky-50 transition-colors shadow-lg flex items-center mx-auto">
              Start Your Journey
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
