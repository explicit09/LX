import { useLocation } from "wouter";
import { useUser } from "@/lib/user-context";
import { ChevronRight, Book, Users, LineChart, Cloud, Medal, Code } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import logo
import LogoImage from "@assets/LEARN-X Logo.png";

export default function Landing() {
  const [, navigate] = useLocation();
  const { user } = useUser();

  const navigateToDashboard = () => {
    if (user) {
      if (user.role === "professor") {
        navigate("/professor/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navigation */}
      <header className="bg-white py-4 px-6 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src={LogoImage} alt="LEARN-X Logo" className="h-8" />
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
              How It Works
            </a>
            <a href="#for-students" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
              For Students
            </a>
            <a href="#for-educators" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
              For Educators
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <Button onClick={navigateToDashboard}>
                Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/auth")}>
                  Log In
                </Button>
                <Button onClick={() => navigate("/auth")}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-block bg-blue-100 text-blue-600 rounded-full px-4 py-1 text-sm font-medium mb-6">
            AI Learning Platform
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Learn it your way.
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Traditional learning doesn't work for everyone. Our AI-powered platform personalizes 
            education to match your student's unique learning style.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" onClick={navigateToDashboard} className="bg-blue-600 hover:bg-blue-700">
              Go to Dashboard <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
              How It Works
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">
            Revolutionize Your Student's Learning
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Book className="h-6 w-6 text-blue-600" />}
              title="Personalized Learning"
              description="AI adapts to your student's unique learning style for maximum engagement"
            />
            
            <FeatureCard 
              icon={<Users className="h-6 w-6 text-blue-600" />}
              title="Integration with Canvas"
              description="Add your course info to Canvas and LEARN-X can take it and use it to personalize learning for your students"
            />
            
            <FeatureCard 
              icon={<Cloud className="h-6 w-6 text-blue-600" />}
              title="Cloud Integration"
              description="Access your learning materials anywhere, anytime with cloud storage"
            />
            
            <FeatureCard 
              icon={<Medal className="h-6 w-6 text-blue-600" />}
              title="No Cheating Allowed"
              description="Our AI prompting does not allow for students to receive answers for their assignments, just helpful insights"
            />
            
            <FeatureCard 
              icon={<LineChart className="h-6 w-6 text-blue-600" />}
              title="Progress Analytics"
              description="Detailed insights into your student's learning journey with metrics to track their improvement over time"
            />
            
            <FeatureCard 
              icon={<Code className="h-6 w-6 text-blue-600" />}
              title="Interactive Course Materials"
              description="Upload or link your Canvas modules that transform into interactive learning modules"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-6 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="text-blue-600 font-medium mb-4">HOW IT WORKS</div>
              <h2 className="text-3xl font-bold mb-6">
                Your Student's Personalized Learning Journey
              </h2>
              
              <p className="text-gray-600 mb-8">
                LEARN-X uses advanced AI to transform existing Canvas materials into engaging, 
                personalized learning pathways tailored to each student's style, pace, and goals.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-800 font-medium">Instant syllabus generation from any Canvas materials</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-800 font-medium">Smart quizzes that adapt to your student's learning pace</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-800 font-medium">Detailed progress tracking and performance insights</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-800 font-medium">Ethical AI that supports learning, not shortcuts</p>
                  </div>
                </div>
              </div>
              
              <Button className="mt-8 bg-blue-600 hover:bg-blue-700">
                Learn More <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="lg:w-1/2 bg-white p-8 rounded-xl shadow-sm">
              <div className="w-full h-64 bg-blue-50 rounded-lg flex items-center justify-center">
                <div className="space-y-4 w-full px-6">
                  <div className="h-4 bg-blue-200 rounded-full w-full"></div>
                  <div className="h-4 bg-blue-200 rounded-full w-5/6"></div>
                  <div className="h-4 bg-blue-200 rounded-full w-4/6"></div>
                  
                  <div className="h-10"></div>
                  
                  <div className="h-4 bg-blue-200 rounded-full w-5/6"></div>
                  <div className="h-4 bg-blue-200 rounded-full w-full"></div>
                  
                  <div className="flex mt-8 space-x-4">
                    <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                    <div className="h-4 bg-blue-200 rounded-full w-4/5"></div>
                  </div>
                  
                  <div className="flex mt-4 space-x-4">
                    <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                    <div className="h-4 bg-blue-200 rounded-full w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto bg-blue-100 rounded-2xl p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to transform your student's education?
            </h2>
            
            <p className="text-gray-600 mb-8">
              Join hundreds of institutions who are already teaching their students with 
              personalized AI learning.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" onClick={navigateToDashboard} className="bg-blue-600 hover:bg-blue-700">
                Go to Dashboard <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Schedule a Demo
              </Button>
            </div>
            
            <p className="text-sm text-gray-500 mt-6">
              No credit card required. Start with a free 14-day trial.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <img src={LogoImage} alt="LEARN-X Logo" className="h-8 mb-4" />
              <p className="text-gray-400 text-sm">
                Transforming education with AI-powered personalized learning experiences.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">How It Works</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">FAQs</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Guides</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">API Reference</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 LEARN-X. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string | JSX.Element }) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all">
      <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
        {typeof icon === 'string' ? icon : icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}