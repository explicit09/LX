import React from 'react';
import { Link } from 'wouter';
import { ChevronRight, CheckCircle2, GraduationCap } from 'lucide-react';

// Import logo
import LogoImage from "@assets/LEARN-X Logo.png";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white -z-10" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-0 w-1/3 h-1/3 bg-gradient-to-br from-gray-100 to-white rounded-full blur-3xl opacity-70 -z-10" />
        <div className="absolute bottom-0 left-1/4 w-1/4 h-1/4 bg-gradient-to-tr from-gray-100 to-white rounded-full blur-3xl opacity-50 -z-10" />
        
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center rounded-full bg-gray-900 px-5 py-1.5 text-sm font-medium text-white">
                <span className="mr-2">✨</span>
                <span>The future of learning is conversational</span>
              </div>
            </div>
            
            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
              Turn content into conversations
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-600 text-center mb-12 max-w-3xl mx-auto leading-relaxed">
              LEARN-X transforms your course materials into an AI tutor that adapts to how each student learns.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center mb-16">
              <Link 
                to="/register" 
                className="flex items-center justify-center bg-black text-white hover:bg-gray-800 px-8 py-4 rounded-lg font-medium transition-all shadow-sm hover:shadow text-lg group"
              >
                Start learning now
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/demo" 
                className="flex items-center justify-center bg-white text-black hover:bg-gray-50 px-8 py-4 rounded-lg font-medium transition-all border border-gray-200 shadow-sm hover:shadow text-lg"
              >
                See how it works
              </Link>
            </div>
            
            {/* Social proof */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Trusted by 500+ universities</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>1M+ students learning daily</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>95% satisfaction rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main device display section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background design elements */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-full max-w-7xl h-full">
          <div className="absolute left-0 top-1/4 w-64 h-64 bg-gray-100 rounded-full blur-3xl opacity-70 -z-10"></div>
          <div className="absolute right-0 bottom-1/4 w-96 h-96 bg-gray-100 rounded-full blur-3xl opacity-70 -z-10"></div>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-black p-1.5 rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-black rounded-3xl overflow-hidden">
                {/* Browser-like control bar */}
                <div className="h-8 bg-gray-900 flex items-center px-4 space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-800 h-5 w-full max-w-md mx-auto rounded-full"></div>
                  </div>
                </div>
                
                {/* Chat interface mockup */}
                <div className="aspect-video bg-gray-950 p-6 flex">
                  {/* Left sidebar */}
                  <div className="hidden md:block w-64 bg-gray-900 rounded-l-lg overflow-hidden mr-1">
                    <div className="p-4 border-b border-gray-800">
                      <div className="h-6 w-32 bg-gray-800 rounded-md"></div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="h-5 w-full bg-gray-800 rounded-md"></div>
                      <div className="h-5 w-3/4 bg-gray-800 rounded-md"></div>
                      <div className="h-5 w-5/6 bg-gray-800 rounded-md"></div>
                      <div className="h-5 w-2/3 bg-gray-800 rounded-md"></div>
                    </div>
                  </div>
                  
                  {/* Chat content */}
                  <div className="flex-1 bg-gray-900 rounded-lg flex flex-col">
                    {/* Chat messages */}
                    <div className="flex-1 p-4 space-y-4 overflow-hidden">
                      {/* User message */}
                      <div className="flex justify-end">
                        <div className="bg-black text-white px-4 py-2 rounded-2xl rounded-tr-sm max-w-xs">
                          <p className="text-sm">Can you explain the process of photosynthesis?</p>
                        </div>
                      </div>
                      
                      {/* AI response */}
                      <div className="flex justify-start">
                        <div className="bg-gray-800 text-gray-100 px-4 py-2 rounded-2xl rounded-tl-sm max-w-lg">
                          <p className="text-sm">Photosynthesis is the process by which plants convert light energy into chemical energy. It happens in the chloroplasts, where chlorophyll captures sunlight...</p>
                        </div>
                      </div>
                      
                      {/* Animated typing indicator */}
                      <div className="flex justify-start">
                        <div className="bg-gray-800 text-white px-4 py-3 rounded-2xl rounded-tl-sm inline-flex space-x-1">
                          <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse"></div>
                          <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" style={{animationDelay: "0.2s"}}></div>
                          <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" style={{animationDelay: "0.4s"}}></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Input field */}
                    <div className="p-4 border-t border-gray-800">
                      <div className="relative">
                        <div className="h-12 bg-gray-800 rounded-full px-4 flex items-center">
                          <div className="h-4 w-3/4 bg-gray-700 rounded-full"></div>
                          <div className="ml-auto h-8 w-8 bg-white rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 border-t-2 border-r-2 border-black transform rotate-45 translate-x-[-2px]"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-flex items-center rounded-full bg-black px-3 py-1 text-xs font-medium text-white mb-6">
                <span>Our Features</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Save hours, learn smarter</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our AI-powered platform transforms how you interact with learning materials
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-10">
              {/* Feature 1 */}
              <div className="group relative">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-gray-200 to-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-md"></div>
                <div className="relative bg-white rounded-xl shadow-sm p-8 border border-gray-100 group-hover:border-gray-200 transition-all duration-500">
                  <div className="w-12 h-12 mb-6 bg-black rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Upload any content</h3>
                  <p className="text-gray-600 leading-relaxed">
                    PDFs, lectures, videos, slides—we process it all. Our AI analyzes your materials to create a personalized learning experience.
                  </p>
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <span className="inline-flex items-center text-sm font-medium text-black">
                      Learn more
                      <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Feature 2 */}
              <div className="group relative">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-gray-200 to-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-md"></div>
                <div className="relative bg-white rounded-xl shadow-sm p-8 border border-gray-100 group-hover:border-gray-200 transition-all duration-500">
                  <div className="w-12 h-12 mb-6 bg-black rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Test your knowledge</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Generate quizzes, flashcards, and practice tests based on your materials. Track progress and focus on areas that need improvement.
                  </p>
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <span className="inline-flex items-center text-sm font-medium text-black">
                      Learn more
                      <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Feature 3 */}
              <div className="group relative">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-gray-200 to-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-md"></div>
                <div className="relative bg-white rounded-xl shadow-sm p-8 border border-gray-100 group-hover:border-gray-200 transition-all duration-500">
                  <div className="w-12 h-12 mb-6 bg-black rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Talk with an AI Tutor</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Ask questions about complex topics and get clear, concise explanations. Our AI tutor adapts to your learning style and pace.
                  </p>
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <span className="inline-flex items-center text-sm font-medium text-black">
                      Learn more
                      <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Study Materials Section */}
      <section className="py-24 bg-white relative">
        {/* Background gradient accent */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-gray-50 to-white -z-10"></div>
        
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center rounded-full bg-black px-3 py-1 text-xs font-medium text-white mb-6">
                <span>Learning Materials</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Study any subject, anytime</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Explore our growing library of study materials or upload your own
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-x-8 gap-y-10">
              {/* Card 1 */}
              <div className="group relative">
                <div className="block overflow-hidden rounded-2xl transition-all">
                  <div className="relative">
                    {/* Card image/placeholder */}
                    <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl overflow-hidden group-hover:shadow-md transition-all">
                      {/* Subject icon/number */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center">
                          <div className="text-6xl font-serif font-medium text-gray-400 group-hover:text-black transition-colors">11</div>
                          <div className="mt-2 text-sm font-medium text-gray-500">Chapter</div>
                        </div>
                      </div>
                      
                      {/* Hover overlay with indication it's clickable */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <div className="bg-black text-white rounded-full px-4 py-2 text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-all">
                          View Material
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card content */}
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold group-hover:text-black transition-colors">The Genetic Code & Translation</h3>
                    <p className="mt-1 text-sm text-gray-600">Biology • Advanced • PDF</p>
                  </div>
                </div>
              </div>
              
              {/* Card 2 */}
              <div className="group relative">
                <div className="block overflow-hidden rounded-2xl transition-all">
                  <div className="relative">
                    {/* Card image/placeholder */}
                    <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl overflow-hidden group-hover:shadow-md transition-all">
                      {/* Video icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-black bg-opacity-5 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="mt-2 text-sm font-medium text-gray-500">Video Lecture</div>
                        </div>
                      </div>
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <div className="bg-black text-white rounded-full px-4 py-2 text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-all">
                          Watch Lecture
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card content */}
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold group-hover:text-black transition-colors">Introduction to Human Biology</h3>
                    <p className="mt-1 text-sm text-gray-600">Biology • Beginner • Video</p>
                  </div>
                </div>
              </div>
              
              {/* Card 3 */}
              <div className="group relative">
                <div className="block overflow-hidden rounded-2xl transition-all">
                  <div className="relative">
                    {/* Card image/placeholder */}
                    <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl overflow-hidden group-hover:shadow-md transition-all">
                      {/* Document icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <div className="mt-2 text-sm font-medium text-gray-500">Course Notes</div>
                        </div>
                      </div>
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <div className="bg-black text-white rounded-full px-4 py-2 text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-all">
                          View Notes
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card content */}
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold group-hover:text-black transition-colors">Cognitive Psychology</h3>
                    <p className="mt-1 text-sm text-gray-600">Psychology • Intermediate • PDF</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* View all link */}
            <div className="mt-16 text-center">
              <a href="#materials" className="inline-flex items-center text-black font-medium hover:underline">
                Browse all materials
                <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 -z-10"></div>
        
        {/* Decorative elements */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-50 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-50 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto">
            {/* Card-like container */}
            <div className="bg-white rounded-3xl shadow-xl p-12 relative overflow-hidden">
              {/* Subtle decorative corner accent */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gray-50 -z-10 transform translate-x-20 -translate-y-20 rounded-full"></div>
              
              <div className="text-center mb-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Study smarter, not harder</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Let our AI analyze your learning materials and help you master even the most complex subjects. Join thousands of students achieving their goals.
                </p>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-10">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">500+</div>
                  <div className="text-gray-600">Universities</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">1M+</div>
                  <div className="text-gray-600">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">95%</div>
                  <div className="text-gray-600">Satisfaction</div>
                </div>
              </div>
              
              {/* CTA button */}
              <div className="text-center">
                <Link 
                  to="/register" 
                  className="inline-flex items-center bg-black text-white hover:bg-gray-800 px-8 py-4 rounded-lg font-medium transition-all shadow-sm hover:shadow text-lg"
                >
                  Start learning for free
                  <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <p className="mt-4 text-sm text-gray-500">No credit card required</p>
              </div>
            </div>
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