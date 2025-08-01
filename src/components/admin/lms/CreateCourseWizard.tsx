
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, ExternalLink, Save } from "lucide-react";
import { CourseDetailsStep } from "./wizard/CourseDetailsStep";
import { CourseContentStep } from "./wizard/CourseContentStep";
import { AdditionalInfoStep } from "./wizard/AdditionalInfoStep";
import { CourseReviewStep } from "./wizard/CourseReviewStep";
import { EnhancedVideoPlayer } from "@/components/EnhancedVideoPlayer";
import { useCourses } from "@/hooks/useCourses";
import { useToast } from "@/hooks/use-toast";
import { generateCourseSlug } from "@/utils/youtubeUtils";
import { useCourseTopics } from "@/hooks/useCourseTopics";

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
  duration: number; // in minutes
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
  course?: any;
  isEditMode?: boolean;
}

const steps = [
  { id: 1, title: "Course Details", description: "Basic course information" },
  { id: 2, title: "Course Content", description: "Topics, lessons, and quizzes" },
  { id: 3, title: "Additional Info", description: "Learning outcomes and requirements" },
  { id: 4, title: "Review", description: "Review and publish" },
];

export const CreateCourseWizard = ({ onClose, course, isEditMode = false }: CreateCourseWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createdCourseId, setCreatedCourseId] = useState<string | null>(null);
  const [previewVideo, setPreviewVideo] = useState<{ url: string; isOpen: boolean }>({
    url: "",
    isOpen: false
  });
  const { toast } = useToast();
  
  const [wizardData, setWizardData] = useState<CourseWizardData>({
    title: course?.title || "",
    description: course?.description || "",
    instructor: course?.instructor || "",
    category: course?.category || "",
    level: course?.level || "Beginner",
    status: course?.status || "Draft",
    priceType: course?.price > 0 ? "paid" : "free",
    price: course?.price || 0,
    tags: [],
    featuredImage: "",
    introVideo: course?.intro_video || "",
    topics: [],
    learningOutcomes: course?.learning_outcomes || [],
    targetAudience: "",
    prerequisites: course?.requirements || "",
    hasCertificate: false,
    certificateImage: "",
  });

  const { createCourse, updateCourse, saveCourseContent } = useCourses();
  const { data: existingTopics, isLoading: isLoadingTopics } = useCourseTopics(
    isEditMode && course ? course.id : null
  );

  // Load existing course content when editing
  useEffect(() => {
    if (isEditMode && existingTopics && existingTopics.length > 0) {
      console.log("Loading existing topics into wizard:", existingTopics);
      setWizardData(prev => ({
        ...prev,
        topics: existingTopics,
      }));
    }
  }, [isEditMode, existingTopics]);

  const updateWizardData = (updates: Partial<CourseWizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }));
  };

  const openVideoPreview = (videoUrl: string) => {
    setPreviewVideo({ url: videoUrl, isOpen: true });
  };

  const closeVideoPreview = () => {
    setPreviewVideo({ url: "", isOpen: false });
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

  // Calculate total duration from lessons
  const calculateTotalDuration = (): number => {
    return wizardData.topics.reduce((total, topic) => {
      return total + topic.items
        .filter(item => item.type === "lesson")
        .reduce((topicTotal, lesson) => topicTotal + (lesson as Lesson).duration, 0);
    }, 0);
  };

  const handleSaveAsDraft = async () => {
    const totalDurationMinutes = calculateTotalDuration();
    const totalHours = Math.round(totalDurationMinutes / 60);

    const courseData = {
      title: wizardData.title || "Untitled Course",
      description: wizardData.description,
      instructor: wizardData.instructor,
      category: wizardData.category,
      level: wizardData.level,
      status: "Draft",
      price: wizardData.priceType === "paid" ? wizardData.price : 0,
      duration_hours: totalHours,
      intro_video: wizardData.introVideo,
      learning_outcomes: wizardData.learningOutcomes,
      requirements: wizardData.prerequisites,
    };

    try {
      if (isEditMode && course) {
        await updateCourse.mutateAsync({ id: course.id, ...courseData });
        if (wizardData.topics.length > 0) {
          await saveCourseContent.mutateAsync({ 
            courseId: course.id, 
            topics: wizardData.topics 
          });
        }
        toast({
          title: "Draft Saved",
          description: "Your course has been saved as draft.",
        });
      } else {
        const result = await createCourse.mutateAsync(courseData);
        setCreatedCourseId(result.id);
        if (wizardData.topics.length > 0) {
          await saveCourseContent.mutateAsync({ 
            courseId: result.id, 
            topics: wizardData.topics 
          });
        }
        toast({
          title: "Draft Saved",
          description: "Your course has been saved as draft.",
        });
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    const totalDurationMinutes = calculateTotalDuration();
    const totalHours = Math.round(totalDurationMinutes / 60);

    const courseData = {
      title: wizardData.title,
      description: wizardData.description,
      instructor: wizardData.instructor,
      category: wizardData.category,
      level: wizardData.level,
      status: wizardData.status,
      price: wizardData.priceType === "paid" ? wizardData.price : 0,
      duration_hours: totalHours,
      intro_video: wizardData.introVideo,
      learning_outcomes: wizardData.learningOutcomes,
      requirements: wizardData.prerequisites,
    };

    try {
      let result;
      if (isEditMode && course) {
        result = await updateCourse.mutateAsync({ id: course.id, ...courseData });
        setCreatedCourseId(course.id);
      } else {
        result = await createCourse.mutateAsync(courseData);
        setCreatedCourseId(result.id);
      }
      
      // Save course content if we have topics
      if (wizardData.topics.length > 0) {
        await saveCourseContent.mutateAsync({ 
          courseId: isEditMode ? course.id : result.id, 
          topics: wizardData.topics 
        });
      }
      
      setIsSubmitted(true);
      
      toast({
        title: isEditMode ? "Course Updated Successfully!" : "Course Created Successfully!",
        description: "Your course has been created and is ready to be shared.",
      });
    } catch (error) {
      console.error("Error creating/updating course:", error);
      toast({
        title: "Error",
        description: isEditMode ? "Failed to update course. Please try again." : "Failed to create course. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Link Copied!",
      description: "Course link has been copied to clipboard.",
    });
  };

  const progress = (currentStep / steps.length) * 100;

  // Success Screen
  if (isSubmitted && createdCourseId) {
    const courseSlug = generateCourseSlug(wizardData.title);
    const courseLink = `${window.location.origin}/course/${createdCourseId}/${courseSlug}`;
    
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <Card>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-bjj-navy">
                  {isEditMode ? "Course Updated Successfully!" : "Course Created Successfully!"}
                </h2>
                <p className="text-gray-600">
                  Your course "{wizardData.title}" has been {isEditMode ? "updated" : "created"} and is now available.
                </p>
              </div>

              <Card className="border-2 border-bjj-gold">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-bjj-navy">Course Direct Link:</h3>
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded border">
                      <code className="text-sm flex-1 text-left">{courseLink}</code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(courseLink)}
                      >
                        Copy Link
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(courseLink, '_blank')}
                      className="w-full"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Course
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="flex space-x-3 justify-center">
                {!isEditMode && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsSubmitted(false);
                      setCreatedCourseId(null);
                      setCurrentStep(1);
                      setWizardData({
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
                    }}
                  >
                    Create Another Course
                  </Button>
                )}
                <Button
                  onClick={onClose}
                  className="bg-bjj-gold hover:bg-bjj-gold-dark text-white"
                >
                  Done
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderStepContent = () => {
    // Show loading while fetching existing topics in edit mode
    if (isEditMode && isLoadingTopics) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bjj-gold mx-auto mb-4"></div>
            <p className="text-gray-600">Loading course content...</p>
          </div>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <CourseDetailsStep
            data={wizardData}
            onUpdate={updateWizardData}
            courseId={isEditMode ? course?.id : createdCourseId}
            onPreviewVideo={openVideoPreview}
          />
        );
      case 2:
        return (
          <CourseContentStep
            data={wizardData}
            onUpdate={updateWizardData}
            onPreviewVideo={openVideoPreview}
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
    <>
      <div className="max-w-6xl mx-auto p-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-bjj-navy">
              {isEditMode ? "Edit Course" : "Create New Course"}
            </CardTitle>
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

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleSaveAsDraft}
              disabled={createCourse.isPending || updateCourse.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
            
            <Button
              onClick={currentStep === steps.length ? handleSubmit : handleNext}
              className="bg-bjj-gold hover:bg-bjj-gold-dark text-white"
              disabled={createCourse.isPending || updateCourse.isPending}
            >
              {createCourse.isPending || updateCourse.isPending 
                ? (isEditMode ? "Updating..." : "Creating...") 
                : currentStep === steps.length 
                  ? (isEditMode ? "Update Course" : "Create Course") 
                  : "Next"
              }
              {currentStep < steps.length && <ArrowRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </div>
      </div>

      <EnhancedVideoPlayer
        primaryUrl={previewVideo.url}
        fallbackUrls={[]}
        mp4Urls={[]}
        isOpen={previewVideo.isOpen}
        onClose={closeVideoPreview}
      />
    </>
  );
};
