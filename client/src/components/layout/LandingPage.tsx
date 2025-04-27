import React from 'react';
import { Link } from 'wouter';

// Import logo
import LogoImage from "@assets/LEARN-X Logo.png";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      {/* Hero Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              An AI tutor made for you
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Turn your learning materials into concise notes, quizzes, interactive chats, and more
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="bg-black text-white hover:bg-gray-800 px-8 py-3 rounded-md font-medium transition-colors"
              >
                Get Started
              </Link>
              <Link 
                to="/demo" 
                className="bg-gray-100 text-gray-900 hover:bg-gray-200 px-8 py-3 rounded-md font-medium transition-colors"
              >
                See Features
              </Link>
            </div>
            <div className="mt-8 text-sm text-gray-500 flex items-center justify-center">
              <span className="flex items-center">
                <span className="flex -space-x-2">
                  <span className="h-6 w-6 rounded-full bg-blue-500"></span>
                  <span className="h-6 w-6 rounded-full bg-purple-500"></span>
                  <span className="h-6 w-6 rounded-full bg-green-500"></span>
                  <span className="h-6 w-6 rounded-full bg-yellow-500"></span>
                </span>
                <span className="ml-3">Loved by over 1 million learners</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main device display section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-black p-6 md:p-8 rounded-3xl shadow-xl overflow-hidden">
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                {/* This would ideally be an image or video of the platform in action */}
                <div className="h-full w-full flex items-center justify-center text-white text-lg">
                  <span>Interactive Platform Demo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">Save hours, learn smarter.</h2>
            <p className="text-xl text-gray-500 text-center mb-16 max-w-3xl mx-auto">
              From key takeaways to specific questions, we've got you covered.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 mb-4 bg-black rounded-md flex items-center justify-center text-white">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Upload any content</h3>
                <p className="text-gray-600">
                  From PDFs and YouTube videos to slides and even recorded lectures, learn everything your way.
                </p>
              </div>
              
              <div className="p-6 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 mb-4 bg-black rounded-md flex items-center justify-center text-white">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Test your knowledge</h3>
                <p className="text-gray-600">
                  Create personalized exams, get answer breakdowns, and track your progress.
                </p>
              </div>
              
              <div className="p-6 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 mb-4 bg-black rounded-md flex items-center justify-center text-white">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Talk with an AI Tutor</h3>
                <p className="text-gray-600">
                  Talk to an AI tutor to simplify ideas and receive guidance on the content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Case Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Built for any use case</h2>
            <p className="text-xl text-gray-500 text-center mb-16 max-w-3xl mx-auto">
              Click on a learning content below, and start your learning journey
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-80 flex items-center justify-center bg-gray-100 rounded-lg mb-4 overflow-hidden">
                  <div className="text-5xl text-gray-800 font-serif">11</div>
                </div>
                <h3 className="text-lg font-medium">The Genetic Code & Translation</h3>
              </div>
              
              <div className="p-6 bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-80 flex items-center justify-center bg-gray-100 rounded-lg mb-4 overflow-hidden">
                  <div className="text-gray-600 font-medium">Lecture Video</div>
                </div>
                <h3 className="text-lg font-medium">Introduction to Human Biology</h3>
              </div>
              
              <div className="p-6 bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-80 flex items-center justify-center bg-gray-100 rounded-lg mb-4 overflow-hidden">
                  <div className="text-lg text-gray-600">Cognitive Psychology</div>
                </div>
                <h3 className="text-lg font-medium">An Introduction</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Study smart. Own your exams.</h2>
            <p className="text-xl text-gray-600 mb-10">
              Turn your uploads into tailored notes and exercises. The more you study, the smarter LEARN-X becomes at identifying your study gaps.
            </p>
            <Link 
              to="/register" 
              className="inline-block bg-black text-white hover:bg-gray-800 px-8 py-3 rounded-md font-medium transition-colors"
            >
              Get started for free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img src={LogoImage} alt="LEARN-X Logo" className="h-8 w-auto mr-2" />
              <span className="text-sm text-gray-600">© {new Date().getFullYear()} LEARN-X Inc.</span>
            </div>
            
            <div className="flex space-x-8 text-sm text-gray-600">
              <a href="#features" className="hover:text-gray-900">Features</a>
              <a href="#pricing" className="hover:text-gray-900">Pricing</a>
              <a href="#careers" className="hover:text-gray-900">Careers</a>
              <a href="#terms" className="hover:text-gray-900">Terms</a>
              <a href="#privacy" className="hover:text-gray-900">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 