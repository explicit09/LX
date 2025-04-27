import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4">
          LINK-X
        </h1>
        <p className="text-xl text-gray-700">
          Course Assistant Platform
        </p>
        <p className="text-gray-600 mt-2 max-w-md mx-auto">
          A powerful AI-powered platform where professors upload materials and 
          students interact with them through intelligent chat.
        </p>
      </div>

      <div className="flex gap-4">
        <Button 
          size="lg"
          onClick={() => setLocation("/auth")}
          className="bg-primary hover:bg-primary/90"
        >
          Get Started
        </Button>
        
        <Button
          size="lg"
          variant="outline"
          onClick={() => window.open("https://github.com/user/repo", "_blank")}
          className="border-primary text-primary hover:bg-primary/10"
        >
          Learn More
        </Button>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
        <FeatureCard 
          title="For Professors"
          description="Upload course materials, manage courses, and track student engagement with AI-powered analytics."
          icon="👨‍🏫"
        />
        <FeatureCard 
          title="For Students"
          description="Get instant answers to your questions about course materials through an AI assistant that knows your course content."
          icon="👩‍🎓"
        />
        <FeatureCard 
          title="AI-Powered"
          description="Advanced AI technology helps understand course materials and provides accurate, contextual responses."
          icon="🤖"
        />
      </div>
    </div>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}