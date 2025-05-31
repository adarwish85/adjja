
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { CourseWizardData } from "../CreateCourseWizard";

interface AdditionalInfoStepProps {
  data: CourseWizardData;
  onUpdate: (updates: Partial<CourseWizardData>) => void;
}

export const AdditionalInfoStep = ({ data, onUpdate }: AdditionalInfoStepProps) => {
  const [newOutcome, setNewOutcome] = useState("");

  const addLearningOutcome = () => {
    if (newOutcome.trim()) {
      onUpdate({ learningOutcomes: [...data.learningOutcomes, newOutcome.trim()] });
      setNewOutcome("");
    }
  };

  const removeLearningOutcome = (index: number) => {
    const updatedOutcomes = data.learningOutcomes.filter((_, i) => i !== index);
    onUpdate({ learningOutcomes: updatedOutcomes });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-bjj-navy">Additional Course Information</h3>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">What will students learn?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={newOutcome}
                onChange={(e) => setNewOutcome(e.target.value)}
                placeholder="Add a learning outcome"
                onKeyPress={(e) => e.key === "Enter" && addLearningOutcome()}
              />
              <Button type="button" onClick={addLearningOutcome} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>

            <div className="space-y-2">
              {data.learningOutcomes.map((outcome, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span>• {outcome}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLearningOutcome(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {data.learningOutcomes.length === 0 && (
              <p className="text-gray-500 text-sm">No learning outcomes added yet.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Target Audience</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={data.targetAudience}
              onChange={(e) => onUpdate({ targetAudience: e.target.value })}
              placeholder="Describe who this course is designed for..."
              rows={4}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Prerequisites</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={data.prerequisites}
              onChange={(e) => onUpdate({ prerequisites: e.target.value })}
              placeholder="List any prerequisites or requirements..."
              rows={4}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Certificate & Badge</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Switch
                checked={data.hasCertificate}
                onCheckedChange={(checked) => onUpdate({ hasCertificate: checked })}
              />
              <Label>Issue certificate upon course completion</Label>
            </div>

            {data.hasCertificate && (
              <div className="space-y-2">
                <Label htmlFor="certificateImage">Certificate/Badge Image URL</Label>
                <Input
                  id="certificateImage"
                  value={data.certificateImage}
                  onChange={(e) => onUpdate({ certificateImage: e.target.value })}
                  placeholder="https://example.com/certificate-template.jpg"
                />
                <p className="text-sm text-gray-600">
                  Upload an image that will be used as the certificate template or badge.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
