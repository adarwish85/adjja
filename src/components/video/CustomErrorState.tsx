
import { AlertCircle, RefreshCw, Download, Headphones } from "lucide-react";
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
  title = "Video Temporarily Unavailable",
  message = "We're experiencing technical difficulties with this video. Our team has been notified and is working to resolve the issue.",
  onRetry,
  onDownload,
  showRetry = true,
  showDownload = false
}: CustomErrorStateProps) => {
  const handleContactSupport = () => {
    // In a real app, this would open a support ticket or contact form
    window.open('mailto:support@yourapp.com?subject=Video Playback Issue', '_blank');
  };

  return (
    <div className="flex flex-col items-center justify-center text-white space-y-6 p-8 min-h-[400px]">
      <AlertCircle className="h-16 w-16 text-red-500" />
      
      <div className="text-center space-y-3 max-w-md">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-300">{message}</p>
        <p className="text-sm text-gray-400">
          If this problem persists, please contact our support team for assistance.
        </p>
      </div>

      <div className="flex gap-3 flex-wrap justify-center">
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

        <Button 
          onClick={handleContactSupport}
          variant="outline"
          className="text-white border-gray-400 hover:bg-gray-800"
        >
          <Headphones className="h-4 w-4 mr-2" />
          Contact Support
        </Button>
      </div>
    </div>
  );
};
