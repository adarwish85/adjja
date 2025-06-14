
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Play, Eye } from "lucide-react";

interface CourseContentAccordionProps {
  courseTopics: any[];
  totalLessons: number;
  totalHours: number;
  totalMinutes: number;
  onVideoPreview: (videoUrl: string) => void;
}

export const CourseContentAccordion: React.FC<CourseContentAccordionProps> = ({
  courseTopics,
  totalLessons,
  totalHours,
  totalMinutes,
  onVideoPreview,
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-bjj-navy mb-4">Course content</h2>
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <span>{courseTopics.length} sections • {totalLessons} lectures • {totalHours}h {totalMinutes}m total length</span>
        </div>
        
        {courseTopics.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {courseTopics.map((topic, topicIndex) => {
              const topicLessons = topic.course_lessons || [];
              const topicDuration = topicLessons.reduce((sum: number, lesson: any) => sum + (lesson.duration_minutes || 10), 0);
              
              return (
                <AccordionItem key={topic.id} value={`topic-${topicIndex}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex justify-between items-center w-full pr-4">
                      <span className="font-medium">{topic.title}</span>
                      <span className="text-sm text-gray-600">
                        {topicLessons.length} lectures • {Math.floor(topicDuration / 60)}h {topicDuration % 60}m
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 ml-4">
                      {topicLessons.map((lesson: any) => (
                        <div key={lesson.id} className="flex items-center justify-between text-sm border-b pb-2">
                          <div className="flex items-center gap-2 flex-1">
                            <Play className="h-3 w-3 text-gray-400" />
                            <span className="flex-1">{lesson.title}</span>
                            {lesson.is_preview && lesson.video_url && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onVideoPreview(lesson.video_url)}
                                className="text-bjj-gold hover:text-bjj-gold-dark h-6 px-2"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Preview
                              </Button>
                            )}
                          </div>
                          <span className="text-gray-500 ml-2">{lesson.duration_minutes || 10} min</span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <div className="border rounded-lg p-4 text-center text-gray-500">
            Course content is being prepared. Check back soon!
          </div>
        )}
      </CardContent>
    </Card>
  );
};
