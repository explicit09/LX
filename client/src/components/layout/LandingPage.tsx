import React from 'react';
import { Link } from 'wouter';

// Import logo
import LogoImage from "@assets/LEARN-X Logo.png";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="animate-fade-in mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-500">
                Transform Learning
              </span>{' '}
              Through AI-Powered Conversations
            </h1>
            <p className="text-xl md:text-2xl text-neutral-700 dark:text-neutral-300 mb-8 animate-fade-in animate-delay-200">
              LEARN-X turns course materials into interactive AI experiences that adapt to each student's needs.
              Professors upload content, students explore through conversation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animate-delay-300">
              <Link 
                to="/register?role=professor" 
                className="btn-primary px-8 py-3 rounded-full text-base md:text-lg"
              >
                I'm a Professor
              </Link>
              <Link 
                to="/register?role=student" 
                className="btn-secondary px-8 py-3 rounded-full text-base md:text-lg"
              >
                I'm a Student
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-neutral-50 dark:bg-neutral-900">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-center mb-16">How LEARN-X Works</h2>
            
            <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
              <div className="order-2 md:order-1">
                <h3 className="mb-4">For Professors</h3>
                <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-6">
                  Upload your course materials securely. LEARN-X processes your PDFs, audio lectures, and more into 
                  a searchable knowledge base with smart citation tracking.
                </p>
                <ul className="space-y-3">
                  {[
                    'Create course-specific access codes',
                    'Upload PDFs and audio recordings',
                    'Automatic content processing and indexing',
                    'View student engagement analytics',
                    'Discover common questions and confusion points'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-3 mt-0.5">
                        <svg className="h-4 w-4 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="order-1 md:order-2">
                <div className="rounded-2xl bg-white dark:bg-neutral-800 shadow-xl overflow-hidden">
                  <div className="p-1 bg-gradient-to-r from-primary-500 to-secondary-500">
                    <div className="bg-white dark:bg-neutral-900 p-8 rounded-t-xl">
                      <img 
                        src="/professor-dashboard.png" 
                        alt="Professor Dashboard" 
                        className="rounded-lg border border-neutral-200 dark:border-neutral-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="rounded-2xl bg-white dark:bg-neutral-800 shadow-xl overflow-hidden">
                  <div className="p-1 bg-gradient-to-r from-accent-500 to-primary-500">
                    <div className="bg-white dark:bg-neutral-900 p-8 rounded-t-xl">
                      <img 
                        src="/student-chat.png" 
                        alt="Student Chat Interface" 
                        className="rounded-lg border border-neutral-200 dark:border-neutral-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="mb-4">For Students</h3>
                <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-6">
                  Learn through conversation. Ask questions about your course materials and get answers with 
                  source citations. LEARN-X understands context and adapts to your learning style.
                </p>
                <ul className="space-y-3">
                  {[
                    'Join courses with access codes',
                    'Chat with AI that knows your course content',
                    'Get answers with proper academic citations',
                    'Review concepts at your own pace',
                    'Explore related topics through natural conversation'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="flex-shrink-0 h-6 w-6 rounded-full bg-accent-100 dark:bg-accent-900 flex items-center justify-center mr-3 mt-0.5">
                        <svg className="h-4 w-4 text-accent-600 dark:text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-center mb-12">What People Are Saying</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  quote: "LEARN-X has transformed how I teach. Students engage with the material more deeply and come to class with better questions.",
                  name: "Dr. Sarah Chen",
                  title: "Professor of Computer Science",
                  image: "https://randomuser.me/api/portraits/women/44.jpg"
                },
                {
                  quote: "The AI helps me understand concepts I struggle with. I can ask questions in my own words and get explanations that make sense to me.",
                  name: "Jason Rodriguez",
                  title: "Engineering Student",
                  image: "https://randomuser.me/api/portraits/men/32.jpg"
                },
                {
                  quote: "As a TA, LEARN-X helps me identify what concepts students are struggling with before our review sessions.",
                  name: "Aisha Johnson",
                  title: "Teaching Assistant",
                  image: "https://randomuser.me/api/portraits/women/65.jpg"
                },
              ].map((testimonial, i) => (
                <div key={i} className="card p-6 flex flex-col h-full">
                  <blockquote className="flex-1 mb-4 italic text-neutral-700 dark:text-neutral-300">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-medium">{testimonial.name}</div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">{testimonial.title}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-6">Ready to Transform Your Learning Experience?</h2>
            <p className="text-xl opacity-90 mb-8">
              Join thousands of professors and students who are using LEARN-X to create more engaging and effective learning experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="bg-white text-primary-700 hover:bg-neutral-100 px-8 py-3 rounded-full text-lg font-medium transition-colors"
              >
                Get Started for Free
              </Link>
              <Link 
                to="/demo" 
                className="bg-transparent border-2 border-white hover:bg-white/10 px-8 py-3 rounded-full text-lg font-medium transition-colors"
              >
                See a Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-neutral-900 text-neutral-400">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-white text-lg font-medium mb-4">LEARN-X</h3>
              <p className="mb-4">
                AI-powered learning platform that transforms course materials into interactive conversations.
              </p>
              <div className="flex space-x-4">
                {['twitter', 'facebook', 'linkedin', 'github'].map((social) => (
                  <a key={social} href={`#${social}`} className="hover:text-white transition-colors">
                    <span className="sr-only">{social}</span>
                    <div className="h-6 w-6 bg-neutral-700 rounded-full"></div>
                  </a>
                ))}
              </div>
            </div>

            {[
              {
                title: 'Platform',
                links: ['Features', 'Pricing', 'Security', 'Roadmap']
              },
              {
                title: 'Resources',
                links: ['Blog', 'Documentation', 'Guides', 'API']
              },
              {
                title: 'Company',
                links: ['About', 'Careers', 'Contact', 'Press']
              }
            ].map((col, i) => (
              <div key={i}>
                <h3 className="text-white text-lg font-medium mb-4">{col.title}</h3>
                <ul className="space-y-2">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a href={`#${link.toLowerCase()}`} className="hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="max-w-6xl mx-auto border-t border-neutral-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} LEARN-X. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {['Terms', 'Privacy', 'Cookies'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 