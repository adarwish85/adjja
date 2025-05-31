
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { CourseDetailsStep } from "./wizard/CourseDetailsStep";
import { CourseContentStep } from "./wizard/CourseContentStep";
import { AdditionalInfoStep } from "./wizard/AdditionalInfoStep";
import { CourseReviewStep } from "./wizard/CourseReviewStep";
import { useCourses } from "@/hooks/useCourses";

export interface CourseWizardData {
  // Step 1: Course Details
  title: string;
  description: string;
  instructor: string;
  category: string;
  level: string;
  status: string;
  priceType: "free" | "paid";
  price: number;
  tags: string[];
  featuredImage: string;
  introVideo: string;
  
  // Step 2: Course Content
  topics: Topic[];
  
  // Step 3: Additional Info
  learningOutcomes: string[];
  targetAudience: string;
  prerequisites: string;
  hasCertificate: boolean;
  certificateImage: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  items: (Lesson | Quiz)[];
}

export interface Lesson {
  id: string;
  type: "lesson";
  name: string;
  content: string;
  featuredImage: string;
  videoUrl: string;
  attachments: string[];
  isPreview: boolean;
}

export interface Quiz {
  id: string;
  type: "quiz";
  title: string;
  description: string;
  questions: Question[];
  timeLimit: number;
  showTimer: boolean;
  feedbackMode: "immediate" | "after_submission";
  attemptsAllowed: number;
  passingGrade: number;
}

export interface Question {
  id: string;
  type: "true_false" | "multiple_choice" | "essay" | "fill_blanks" | "short_answer" | "matching" | "image_answer" | "ordering";
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
}

interface CreateCourseWizardProps {
  onClose: () => void;
}

const steps = [
  { id: 1, title: "Course Details", description: "Basic course information" },
  { id: 2, title: "Course Content", description: "Topics, lessons, and quizzes" },
  { id: 3, title: "Additional Info", description: "Learning outcomes and requirements" },
  { id: 4, title: "Review", description: "Review and publish" },
];

export const CreateCourseWizard = ({ onClose }: CreateCourseWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<CourseWizardData>({
    title: "",
    description: "",
    instructor: "",
    category: "",
    level: "Beginner",
    status: "Draft",
    priceType: "free",
    price: 0,
    tags: [],
    featuredImage: "",
    introVideo: "",
    topics: [],
    learningOutcomes: [],
    targetAudience: "",
    prerequisites: "",
    hasCertificate: false,
    certificateImage: "",
  });

  const { createCourse } = useCourses();

  const updateWizardData = (updates: Partial<CourseWizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Calculate total duration from all video lessons
    const totalDuration = wizardData.topics.reduce((total, topic) => {
      return total + topic.items.filter(item => item.type === "lesson").length * 30; // Assuming 30 min per lesson
    }, 0);

    const courseData = {
      title: wizardData.title,
      description: wizardData.description,
      instructor: wizardData.instructor,
      category: wizardData.category,
      level: wizardData.level,
      status: wizardData.status,
      price: wizardData.priceType === "paid" ? wizardData.price : 0,
      duration_hours: Math.round(totalDuration / 60),
    };

    createCourse.mutate(courseData);
    onClose();
  };

  const progress = (currentStep / steps.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <CourseDetailsStep
            data={wizardData}
            onUpdate={updateWizardData}
          />
        );
      case 2:
        return (
          <CourseContentStep
            data={wizardData}
            onUpdate={updateWizardData}
          />
        );
      case 3:
        return (
          <AdditionalInfoStep
            data={wizardData}
            onUpdate={updateWizardData}
          />
        );
      case 4:
        return (
          <CourseReviewStep
            data={wizardData}
            onUpdate={updateWizardData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-bjj-navy">Create New Course</CardTitle>
          <div className="space-y-4">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex items-center space-x-2 ${
                    step.id === currentStep
                      ? "text-bjj-gold"
                      : step.id < currentStep
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.id === currentStep
                        ? "bg-bjj-gold text-white"
                        : step.id < currentStep
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {step.id < currentStep ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="hidden md:block">
                    <div className="font-medium">{step.title}</div>
                    <div className="text-sm">{step.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={currentStep === 1 ? onClose : handlePrevious}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {currentStep === 1 ? "Cancel" : "Previous"}
        </Button>

        <Button
          onClick={currentStep === steps.length ? handleSubmit : handleNext}
          className="bg-bjj-gold hover:bg-bjj-gold-dark text-white"
        >
          {currentStep === steps.length ? "Create Course" : "Next"}
          {currentStep < steps.length && <ArrowRight className="h-4 w-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
};
