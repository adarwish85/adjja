
import { Play, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CustomLoadingStateProps {
  onRetry?: () => void;
  progress?: number;
  showRetry?: boolean;
}

export const CustomLoadingState = ({ 
  onRetry, 
  progress = 0, 
  showRetry = false 
}: CustomLoadingStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-white space-y-6 p-8 min-h-[400px]">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
        <Play className="absolute inset-0 m-auto h-8 w-8 text-white" />
      </div>
      
      <div className="text-center space-y-3">
        <h3 className="text-xl font-semibold">Loading Video</h3>
        <p className="text-gray-300 max-w-md">
          Preparing your video for the best viewing experience...
        </p>
        
        {progress > 0 && (
          <div className="w-64 bg-gray-700 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}

        {progress > 80 && (
          <p className="text-sm text-gray-400">
            This is taking longer than usual. You can try refreshing if needed.
          </p>
        )}
      </div>

      {showRetry && onRetry && (
        <Button 
          onClick={onRetry}
          variant="outline"
          className="text-white border-white hover:bg-white hover:text-black"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Player
        </Button>
      )}
    </div>
  );
};
