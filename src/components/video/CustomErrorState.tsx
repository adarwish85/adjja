
import { AlertCircle, RefreshCw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CustomErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onDownload?: () => void;
  showRetry?: boolean;
  showDownload?: boolean;
}

export const CustomErrorState = ({
  title = "Video Unavailable",
  message = "We're having trouble loading this video. Please try again or contact support if the issue persists.",
  onRetry,
  onDownload,
  showRetry = true,
  showDownload = false
}: CustomErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-white space-y-6 p-8 min-h-[400px]">
      <AlertCircle className="h-16 w-16 text-red-500" />
      
      <div className="text-center space-y-3 max-w-md">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-300">{message}</p>
      </div>

      <div className="flex gap-3">
        {showRetry && onRetry && (
          <Button 
            onClick={onRetry}
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-black"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
        
        {showDownload && onDownload && (
          <Button 
            onClick={onDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Video
          </Button>
        )}
      </div>
    </div>
  );
};
