
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, ChevronDown, Trash2, GripVertical, Video, HelpCircle, Loader2, Play, AlertCircle } from "lucide-react";
import { CourseWizardData, Topic, Lesson, Quiz, Question } from "../CreateCourseWizard";
import { extractYouTubeVideoId, fetchYouTubeVideoInfo, validateYouTubeUrl } from "@/utils/youtubeUtils";

interface CourseContentStepProps {
  data: CourseWizardData;
  onUpdate: (updates: Partial<CourseWizardData>) => void;
  onPreviewVideo: (videoUrl: string) => void;
}

// YouTube Video Preview Component
const YouTubePreview = ({ url }: { url: string }) => {
  const videoId = extractYouTubeVideoId(url);
  
  if (!videoId) {
    return (
      <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
        Invalid YouTube URL. Please enter a valid YouTube video link.
      </div>
    );
  }

  return (
    <div className="mt-2">
      <div className="aspect-video bg-gray-100 rounded overflow-hidden">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video preview"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <p className="text-sm text-gray-500 mt-1">Video ID: {videoId}</p>
    </div>
  );
};

export const CourseContentStep = ({ data, onUpdate, onPreviewVideo }: CourseContentStepProps) => {
  const [openTopics, setOpenTopics] = useState<string[]>([]);

  // Calculate total course duration
  const calculateTotalDuration = () => {
    return data.topics.reduce((total, topic) => {
      return total + topic.items
        .filter(item => item.type === "lesson")
        .reduce((topicTotal, lesson) => topicTotal + (lesson as Lesson).duration, 0);
    }, 0);
  };

  const addTopic = () => {
    const newTopic: Topic = {
      id: Date.now().toString(),
      title: "",
      description: "",
      items: [],
    };
    onUpdate({ topics: [...data.topics, newTopic] });
    setOpenTopics(prev => [...prev, newTopic.id]);
  };

  const updateTopic = (topicId: string, updates: Partial<Topic>) => {
    const updatedTopics = data.topics.map(topic =>
      topic.id === topicId ? { ...topic, ...updates } : topic
    );
    onUpdate({ topics: updatedTopics });
  };

  const deleteTopic = (topicId: string) => {
    onUpdate({ topics: data.topics.filter(topic => topic.id !== topicId) });
  };

  const addLesson = (topicId: string) => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      type: "lesson",
      name: "",
      content: "",
      featuredImage: "",
      videoUrl: "",
      attachments: [],
      isPreview: false,
      duration: 10, // default duration in minutes
    };
    
    const updatedTopics = data.topics.map(topic =>
      topic.id === topicId
        ? { ...topic, items: [...topic.items, newLesson] }
        : topic
    );
    onUpdate({ topics: updatedTopics });
  };

  const addQuiz = (topicId: string) => {
    const newQuiz: Quiz = {
      id: Date.now().toString(),
      type: "quiz",
      title: "",
      description: "",
      questions: [],
      timeLimit: 30,
      showTimer: true,
      feedbackMode: "immediate",
      attemptsAllowed: 3,
      passingGrade: 70,
    };
    
    const updatedTopics = data.topics.map(topic =>
      topic.id === topicId
        ? { ...topic, items: [...topic.items, newQuiz] }
        : topic
    );
    onUpdate({ topics: updatedTopics });
  };

  const updateItem = (topicId: string, itemId: string, updates: any) => {
    const updatedTopics = data.topics.map(topic =>
      topic.id === topicId
        ? {
            ...topic,
            items: topic.items.map(item =>
              item.id === itemId ? { ...item, ...updates } : item
            ),
          }
        : topic
    );
    onUpdate({ topics: updatedTopics });
  };

  const deleteItem = (topicId: string, itemId: string) => {
    const updatedTopics = data.topics.map(topic =>
      topic.id === topicId
        ? { ...topic, items: topic.items.filter(item => item.id !== itemId) }
        : topic
    );
    onUpdate({ topics: updatedTopics });
  };

  const addQuestion = (topicId: string, quizId: string) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: "multiple_choice",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      points: 1,
    };

    const updatedTopics = data.topics.map(topic =>
      topic.id === topicId
        ? {
            ...topic,
            items: topic.items.map(item =>
              item.id === quizId && item.type === "quiz"
                ? { ...item, questions: [...item.questions, newQuestion] }
                : item
            ),
          }
        : topic
    );
    onUpdate({ topics: updatedTopics });
  };

  const toggleTopic = (topicId: string) => {
    setOpenTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const totalDuration = calculateTotalDuration();
  const totalHours = Math.floor(totalDuration / 60);
  const totalMinutes = totalDuration % 60;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-bjj-navy">Course Content</h3>
          <p className="text-sm text-gray-600">
            Total Duration: {totalHours}h {totalMinutes}m ({data.topics.length} topics)
          </p>
        </div>
        <Button onClick={addTopic} className="bg-bjj-gold hover:bg-bjj-gold-dark text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Topic
        </Button>
      </div>

      <div className="space-y-4">
        {data.topics.map((topic) => (
          <Card key={topic.id}>
            <Collapsible
              open={openTopics.includes(topic.id)}
              onOpenChange={() => toggleTopic(topic.id)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {topic.title || "Untitled Topic"}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {topic.items.length} items
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTopic(topic.id);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Topic Title</Label>
                        <Input
                          value={topic.title}
                          onChange={(e) => updateTopic(topic.id, { title: e.target.value })}
                          placeholder="Enter topic title"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Topic Description</Label>
                      <Textarea
                        value={topic.description}
                        onChange={(e) => updateTopic(topic.id, { description: e.target.value })}
                        placeholder="Enter topic description"
                        rows={2}
                      />
                    </div>

                    {/* Render lessons and quizzes with accordions */}
                    {topic.items.length > 0 && (
                      <div className="space-y-3">
                        <Accordion type="single" collapsible className="w-full">
                          {topic.items.map((item) => (
                            <AccordionItem key={item.id} value={item.id} className="border-l-4 border-l-bjj-gold">
                              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                                <div className="flex items-center space-x-2">
                                  {item.type === "lesson" ? (
                                    <Video className="h-4 w-4" />
                                  ) : (
                                    <HelpCircle className="h-4 w-4" />
                                  )}
                                  <span className="font-medium">
                                    {item.type === "lesson" 
                                      ? (item as Lesson).name || "Untitled Lesson"
                                      : (item as Quiz).title || "Untitled Quiz"
                                    }
                                  </span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="px-4 pb-4">
                                {item.type === "lesson" ? (
                                  <LessonEditor
                                    lesson={item as Lesson}
                                    onUpdate={(updates) => updateItem(topic.id, item.id, updates)}
                                    onDelete={() => deleteItem(topic.id, item.id)}
                                    onPreviewVideo={onPreviewVideo}
                                  />
                                ) : (
                                  <QuizEditor
                                    quiz={item as Quiz}
                                    onUpdate={(updates) => updateItem(topic.id, item.id, updates)}
                                    onDelete={() => deleteItem(topic.id, item.id)}
                                    onAddQuestion={() => addQuestion(topic.id, item.id)}
                                  />
                                )}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    )}

                    {/* Add Lesson and Quiz buttons - always visible at bottom */}
                    <div className="flex space-x-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => addLesson(topic.id)}
                        size="sm"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Add Lesson
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => addQuiz(topic.id)}
                        size="sm"
                      >
                        <HelpCircle className="h-4 w-4 mr-2" />
                        Add Quiz
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      {data.topics.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No topics added yet. Click "Add Topic" to get started.</p>
        </div>
      )}
    </div>
  );
};

// Enhanced Lesson Editor Component with preview functionality
const LessonEditor = ({ lesson, onUpdate, onDelete, onPreviewVideo }: {
  lesson: Lesson;
  onUpdate: (updates: Partial<Lesson>) => void;
  onDelete: () => void;
  onPreviewVideo: (videoUrl: string) => void;
}) => {
  const [isLoadingVideoInfo, setIsLoadingVideoInfo] = useState(false);
  const [urlValidation, setUrlValidation] = useState<{ isValid: boolean; error?: string }>({ isValid: true });

  const handleVideoUrlChange = async (url: string) => {
    console.log('Video URL change:', url);
    
    // Validate URL
    const validation = validateYouTubeUrl(url);
    setUrlValidation(validation);
    
    // First, immediately update the lesson with the new URL to ensure it persists
    onUpdate({ videoUrl: url });
    
    // Only try to fetch video info if it's a valid YouTube URL and we haven't processed this URL before
    if (url && validation.isValid && url !== lesson.videoUrl) {
      const videoId = extractYouTubeVideoId(url);
      if (videoId) {
        setIsLoadingVideoInfo(true);
        try {
          console.log('Fetching video info for:', videoId);
          const videoInfo = await fetchYouTubeVideoInfo(videoId);
          console.log('Fetched video info:', videoInfo);
          
          if (videoInfo) {
            const updates: Partial<Lesson> = { videoUrl: url }; // Always preserve the URL
            
            // Only update duration if it's still the default (10 minutes)
            if (lesson.duration === 10) {
              updates.duration = videoInfo.duration;
              console.log('Updating duration to:', videoInfo.duration);
            }
            
            // Only update the title if it's currently empty
            if (!lesson.name.trim()) {
              updates.name = videoInfo.title;
              console.log('Updating name to:', videoInfo.title);
            }
            
            console.log('Applying updates:', updates);
            onUpdate(updates);
          }
        } catch (error) {
          console.error('Error fetching video info:', error);
          setUrlValidation({ isValid: false, error: 'Failed to load video information' });
          // Even if there's an error, make sure the URL is preserved
          onUpdate({ videoUrl: url });
        } finally {
          setIsLoadingVideoInfo(false);
        }
      }
    }
  };

  const canPreview = lesson.videoUrl && urlValidation.isValid;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {isLoadingVideoInfo && <Loader2 className="h-4 w-4 animate-spin" />}
          {canPreview && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPreviewVideo(lesson.videoUrl)}
            >
              <Play className="h-4 w-4 mr-2" />
              Preview Video
            </Button>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-red-600 hover:text-red-800"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Lesson Name</Label>
          <Input
            value={lesson.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="Enter lesson name"
          />
        </div>
        <div className="space-y-2">
          <Label>Duration (minutes)</Label>
          <Input
            type="number"
            value={lesson.duration}
            onChange={(e) => onUpdate({ duration: parseInt(e.target.value) || 10 })}
            min="1"
            placeholder="10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Video URL (YouTube)</Label>
        <Input
          value={lesson.videoUrl || ""}
          onChange={(e) => handleVideoUrlChange(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className={!urlValidation.isValid ? "border-red-300" : ""}
        />
        {!urlValidation.isValid && urlValidation.error && (
          <div className="flex items-center space-x-2 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{urlValidation.error}</span>
          </div>
        )}
      </div>

      {/* YouTube Video Preview */}
      {lesson.videoUrl && urlValidation.isValid && (
        <YouTubePreview url={lesson.videoUrl} />
      )}

      <div className="space-y-2">
        <Label>Lesson Content</Label>
        <Textarea
          value={lesson.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="Enter lesson content"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Featured Image URL</Label>
          <Input
            value={lesson.featuredImage}
            onChange={(e) => onUpdate({ featuredImage: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={lesson.isPreview}
            onCheckedChange={(checked) => onUpdate({ isPreview: checked })}
          />
          <Label>Enable Course Preview</Label>
        </div>
      </div>
    </div>
  );
};

// Quiz Editor Component
const QuizEditor = ({ quiz, onUpdate, onDelete, onAddQuestion }: {
  quiz: Quiz;
  onUpdate: (updates: Partial<Quiz>) => void;
  onDelete: () => void;
  onAddQuestion: () => void;
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Title is now in the accordion trigger */}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-red-600 hover:text-red-800"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Quiz Title</Label>
          <Input
            value={quiz.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Enter quiz title"
          />
        </div>
        <div className="space-y-2">
          <Label>Time Limit (minutes)</Label>
          <Input
            type="number"
            value={quiz.timeLimit}
            onChange={(e) => onUpdate({ timeLimit: parseInt(e.target.value) || 0 })}
            placeholder="30"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Quiz Description</Label>
        <Textarea
          value={quiz.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Enter quiz description"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            checked={quiz.showTimer}
            onCheckedChange={(checked) => onUpdate({ showTimer: checked })}
          />
          <Label>Show Timer</Label>
        </div>
        <div className="space-y-2">
          <Label>Feedback Mode</Label>
          <Select
            value={quiz.feedbackMode}
            onValueChange={(value: "immediate" | "after_submission") => onUpdate({ feedbackMode: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Immediate</SelectItem>
              <SelectItem value="after_submission">After Submission</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Attempts Allowed</Label>
          <Input
            type="number"
            value={quiz.attemptsAllowed}
            onChange={(e) => onUpdate({ attemptsAllowed: parseInt(e.target.value) || 1 })}
            min="1"
          />
        </div>
        <div className="space-y-2">
          <Label>Passing Grade (%)</Label>
          <Input
            type="number"
            value={quiz.passingGrade}
            onChange={(e) => onUpdate({ passingGrade: parseInt(e.target.value) || 0 })}
            min="0"
            max="100"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h5 className="font-medium">Questions ({quiz.questions.length})</h5>
          <Button
            variant="outline"
            size="sm"
            onClick={onAddQuestion}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </div>
        
        {quiz.questions.map((question, index) => (
          <Card key={question.id} className="border-dashed">
            <CardContent className="p-3">
              <div className="text-sm text-gray-600">
                Question {index + 1} - {question.type.replace("_", " ")}
              </div>
              <div className="text-sm">{question.question || "No question text"}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
