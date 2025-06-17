
import { CoachLayout } from "@/components/layouts/CoachLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

const CoachProfile = () => {
  return (
    <CoachLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-bjj-navy">My Profile</h1>
          <p className="text-bjj-gray">Manage your athlete profile and personal information</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-bjj-navy flex items-center gap-2">
              <User className="h-5 w-5 text-bjj-gold" />
              Athlete Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-bjj-gray">
              <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Profile management coming soon</p>
              <p className="text-xs">Your athlete profile will be available here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </CoachLayout>
  );
};

export default CoachProfile;
