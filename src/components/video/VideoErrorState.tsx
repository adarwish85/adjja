
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, ExternalLink } from "lucide-react";

interface VideoErrorStateProps {
  error: string;
  loadingTimeout: boolean;
  videoUrl: string;
  loading: boolean;
  validationResult?: {
    available: boolean;
    embeddable: boolean;
    error?: string;
  } | null;
  onRetry: () => void;
  onOpenExternally: () => void;
}

export const VideoErrorState = ({ 
  error, 
  loadingTimeout, 
  videoUrl, 
  loading,
  validationResult,
  onRetry, 
  onOpenExternally 
}: VideoErrorStateProps) => {
  const getErrorTitle = () => {
    if (validationResult && !validationResult.available) {
      return 'Video Not Available';
    }
    if (validationResult && !validationResult.embeddable) {
      return 'Embedding Restricted';
    }
    if (loadingTimeout) {
      return 'Loading Timeout';
    }
    return 'Video Loading Error';
  };

  const getErrorMessage = () => {
    if (validationResult?.error) {
      return validationResult.error;
    }
    return error;
  };

  const shouldShowRetry = () => {
    // Don't show retry for fundamental embedding issues
    return !validationResult || (validationResult.available && validationResult.embeddable);
  };

  return (
    <div className="flex flex-col items-center justify-center text-white space-y-4 p-8">
      <AlertCircle className="h-16 w-16 text-red-500" />
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">{getErrorTitle()}</h3>
        <p className="text-gray-300 max-w-md">{getErrorMessage()}</p>
        {!validationResult?.embeddable && (
          <p className="text-sm text-yellow-400">
            This video has embedding restrictions. You can still watch it on YouTube.
          </p>
        )}
      </div>
      <div className="flex gap-3">
        {shouldShowRetry() && (
          <Button 
            onClick={onRetry} 
            variant="outline" 
            className="text-white border-white hover:bg-white hover:text-black"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Try Again'}
          </Button>
        )}
        <Button 
          onClick={onOpenExternally}
          variant="outline"
          className="text-white border-white hover:bg-white hover:text-black"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Open in YouTube
        </Button>
      </div>
    </div>
  );
};
