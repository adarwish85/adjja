
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, ArrowRight } from "lucide-react";

export const LMSSettings = () => {
  const handleNavigateToSettings = () => {
    window.location.href = '/admin/settings';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Settings className="h-5 w-5" />
            LMS Settings Moved
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="max-w-md mx-auto space-y-4">
            <div className="text-6xl mb-4">⚙️</div>
            <h3 className="text-lg font-semibold text-bjj-navy">Settings Have Been Relocated</h3>
            <p className="text-bjj-gray">
              LMS settings have been moved to the centralized Settings module for better organization and consistency across the platform.
            </p>
            <div className="pt-4">
              <Button 
                onClick={handleNavigateToSettings}
                className="bg-bjj-gold hover:bg-bjj-gold-dark text-white"
              >
                Go to Settings
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
            <p className="text-xs text-bjj-gray">
              Look for the "LMS" tab in the centralized settings page
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
