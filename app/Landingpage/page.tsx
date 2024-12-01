
"use client"
import React from 'react';
import { Menu, BookOpen, Users, Bell,ChevronDown } from 'lucide-react';
import { useState } from 'react';
const LandingPage = () => {
  const roadmaps = [
    { title: "Frontend", description: "Step by step guide to becoming a frontend developer" },
    { title: "Backend", description: "Step by step guide to becoming a backend developer" },
    { title: "DevOps", description: "Step by step guide to becoming a DevOps engineer" },
    { title: "Full Stack", description: "Step by step guide to becoming a full stack developer" },
    { title: "AI Engineer", description: "Step by step guide to becoming an AI engineer", isNew: true },
    { title: "Data Analyst", description: "Step by step guide to becoming a data analyst" },
    { title: "AI and Data Scientist", description: "Step by step guide to becoming an AI and data scientist" },
    { title: "Android", description: "Step by step guide to becoming an Android developer" },
    { title: "iOS", description: "Step by step guide to becoming an iOS developer" },
    { title: "PostgreSQL", description: "Step by step guide to mastering PostgreSQL" },
    { title: "Blockchain", description: "Step by step guide to becoming a blockchain developer" },
    { title: "QA", description: "Step by step guide to becoming a QA engineer" }
  ];
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <button className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white">
                <Menu className="h-6 w-6" />
              </button>

              <div className="flex-shrink-0">
                <img src="/api/placeholder/32/32" alt="Logo" className="h-8 w-8 rounded" />
              </div>

              <div className="hidden lg:flex items-center gap-8 ml-8">
                <a href="#" className="text-gray-300 hover:text-white text-sm font-medium">
                  Start Here
                </a>
                <div className="relative group">
                  <button className="flex items-center gap-2 text-gray-300 hover:text-white text-sm font-medium">
                    Roadmaps
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
                <a href="#" className="text-gray-300 hover:text-white text-sm font-medium">
                  Teams
                </a>
                <a href="#" className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1">
                  Changelog
                  <span className="flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-300 hover:text-white text-sm font-medium">
                Login
              </a>
              <a 
                href="#" 
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded transition-colors duration-200"
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>

        <div className={`lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-md">
              Start Here
            </a>
            <a href="#" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-md">
              Roadmaps
            </a>
            <a href="#" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-md">
              Teams
            </a>
            <a href="#" className="block px-3 py-2 text-base font-medium text-blue-400 hover:text-blue-300 hover:bg-gray-800 rounded-md">
              Changelog
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10">
            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-purple-500/20">
              <BookOpen className="h-4 w-4 text-purple-400" />
            </div>
            <span className="text-purple-400">Practice your skills with projects</span>
          </div>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            Developer Roadmaps
          </h1>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto">
            Roadmap is a collaborative community initiative that creates roadmaps, guides, and educational resources to support developers in choosing a career path and advancing their skills.
          </p>

        </div>

        <div>
          <h2 className="text-xl text-gray-400 mb-6">Role-based Roadmaps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roadmaps.map((roadmap) => (
              <div key={roadmap.title} className="relative group">
                <div className="p-6 rounded-lg border border-gray-800 bg-gray-900 hover:border-gray-700 transition-all duration-200">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-gray-100">{roadmap.title}</h3>
                    {roadmap.isNew && (
                      <span className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-400">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{roadmap.description}</p>
                </div>
                <button className="absolute top-4 right-4 text-gray-600 hover:text-gray-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;