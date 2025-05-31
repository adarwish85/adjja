
import { LandingPage } from "@/components/LandingPage";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bjj-navy to-bjj-navy/90">
      {/* Navigation Header */}
      <nav className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-bjj-gold rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <h1 className="text-white text-xl font-bold">ADJJA Academy</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-bjj-navy">
                  Student Login
                </Button>
              </Link>
              <Button className="bg-bjj-gold hover:bg-bjj-gold-dark text-white">
                Admin Portal
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <LandingPage />
    </div>
  );
};

export default Index;
