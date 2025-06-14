
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface VideoLoadingStateProps {
  onOpenExternally: () => void;
}

export const VideoLoadingState = ({ onOpenExternally }: VideoLoadingStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-white space-y-4 p-8">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
      <div className="text-center space-y-2">
        <p className="text-lg">Loading video...</p>
        <p className="text-sm text-gray-400">This may take a few moments</p>
        <div className="mt-4">
          <Button 
            onClick={onOpenExternally}
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-black"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Skip to External Link
          </Button>
        </div>
      </div>
    </div>
  );
};
