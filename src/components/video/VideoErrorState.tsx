
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, ExternalLink } from "lucide-react";

interface VideoErrorStateProps {
  error: string;
  loadingTimeout: boolean;
  videoUrl: string;
  loading: boolean;
  onRetry: () => void;
  onOpenExternally: () => void;
}

export const VideoErrorState = ({ 
  error, 
  loadingTimeout, 
  videoUrl, 
  loading, 
  onRetry, 
  onOpenExternally 
}: VideoErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-white space-y-4 p-8">
      <AlertCircle className="h-16 w-16 text-red-500" />
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">
          {loadingTimeout ? 'Loading Timeout' : 'Video Loading Error'}
        </h3>
        <p className="text-gray-300 max-w-md">{error}</p>
        <p className="text-sm text-gray-400">URL: {videoUrl}</p>
      </div>
      <div className="flex gap-3">
        <Button 
          onClick={onRetry} 
          variant="outline" 
          className="text-white border-white hover:bg-white hover:text-black"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Loading...' : 'Try Again'}
        </Button>
        <Button 
          onClick={onOpenExternally}
          variant="outline"
          className="text-white border-white hover:bg-white hover:text-black"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Open Externally
        </Button>
      </div>
    </div>
  );
};
