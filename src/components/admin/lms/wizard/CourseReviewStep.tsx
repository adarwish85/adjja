
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CourseWizardData } from "../CreateCourseWizard";

interface CourseReviewStepProps {
  data: CourseWizardData;
  onUpdate: (updates: Partial<CourseWizardData>) => void;
}

export const CourseReviewStep = ({ data }: CourseReviewStepProps) => {
  const totalLessons = data.topics.reduce((total, topic) => 
    total + topic.items.filter(item => item.type === "lesson").length, 0
  );

  const totalQuizzes = data.topics.reduce((total, topic) => 
    total + topic.items.filter(item => item.type === "quiz").length, 0
  );

  const estimatedDuration = Math.round(totalLessons * 30 / 60); // 30 min per lesson

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-bjj-navy">Review Course Details</h3>
      <p className="text-gray-600">Please review all course information before creating the course.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Course Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Title</Label>
              <p className="font-medium">{data.title || "Untitled Course"}</p>
            </div>
            
            <div>
              <Label>Description</Label>
              <p className="text-sm text-gray-600">
                {data.description || "No description provided"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Instructor</Label>
                <p className="font-medium">{data.instructor || "Not selected"}</p>
              </div>
              <div>
                <Label>Category</Label>
                <p className="font-medium">{data.category || "Not selected"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Level</Label>
                <Badge variant="outline">{data.level}</Badge>
              </div>
              <div>
                <Label>Status</Label>
                <Badge className={data.status === "Published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                  {data.status}
                </Badge>
              </div>
            </div>

            <div>
              <Label>Price</Label>
              <p className="font-medium">
                {data.priceType === "free" ? "Free" : `$${data.price}`}
              </p>
            </div>

            {data.tags.length > 0 && (
              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {data.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Course Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Topics</Label>
                <p className="text-2xl font-bold text-bjj-gold">{data.topics.length}</p>
              </div>
              <div>
                <Label>Lessons</Label>
                <p className="text-2xl font-bold text-bjj-gold">{totalLessons}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Quizzes</Label>
                <p className="text-2xl font-bold text-bjj-gold">{totalQuizzes}</p>
              </div>
              <div>
                <Label>Est. Duration</Label>
                <p className="text-2xl font-bold text-bjj-gold">{estimatedDuration}h</p>
              </div>
            </div>

            <div>
              <Label>Certificate</Label>
              <p className="font-medium">
                {data.hasCertificate ? "✅ Enabled" : "❌ Disabled"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {data.topics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Course Content Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topics.map((topic, index) => (
                <div key={topic.id}>
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-bjj-navy">
                      {index + 1}. {topic.title || "Untitled Topic"}
                    </h4>
                    <div className="text-sm text-gray-500">
                      {topic.items.length} items
                    </div>
                  </div>
                  
                  {topic.description && (
                    <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
                  )}

                  <div className="ml-4 mt-2 space-y-1">
                    {topic.items.map((item, itemIndex) => (
                      <div key={item.id} className="flex items-center text-sm">
                        <span className="w-6 text-gray-400">{itemIndex + 1}.</span>
                        <span className={item.type === "lesson" ? "text-blue-600" : "text-green-600"}>
                          {item.type === "lesson" ? "📹" : "❓"}
                        </span>
                        <span className="ml-2">
                          {item.type === "lesson" 
                            ? (item as any).name || "Untitled Lesson"
                            : (item as any).title || "Untitled Quiz"
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {index < data.topics.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {data.learningOutcomes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Learning Outcomes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.learningOutcomes.map((outcome, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-bjj-gold mr-2">•</span>
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {(data.targetAudience || data.prerequisites) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.targetAudience && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Target Audience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{data.targetAudience}</p>
              </CardContent>
            </Card>
          )}

          {data.prerequisites && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Prerequisites</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{data.prerequisites}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
    {children}
  </span>
);
