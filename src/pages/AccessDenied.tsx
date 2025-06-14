
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const AccessDenied = () => {
  const navigate = useNavigate();
  const { userProfile, isAdmin, isCoach, isStudent } = useAuth();

  const handleGoToDashboard = () => {
    if (isAdmin()) {
      navigate("/admin");
    } else if (isCoach()) {
      navigate("/coach");
    } else if (isStudent()) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-bjj-navy">Access Denied</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-bjj-gray">
            You don't have permission to access this page.
          </p>
          {userProfile && (
            <p className="text-sm text-bjj-gray">
              Current role: <span className="font-semibold">{userProfile.role_name}</span>
            </p>
          )}
          <div className="space-y-3">
            <Button
              onClick={handleGoToDashboard}
              className="w-full bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy"
            >
              Go to My Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessDenied;
