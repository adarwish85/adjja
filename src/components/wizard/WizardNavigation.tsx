
import { Button } from "@/components/ui/button";

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  onPrevious: (e?: React.MouseEvent) => void;
  onNext: (e?: React.MouseEvent) => void;
  onSkipAndSubmit: (e?: React.MouseEvent) => void;
  onSubmit: (e?: React.MouseEvent) => void;
  isStepValid: boolean;
}

export const WizardNavigation = ({
  currentStep,
  totalSteps,
  isSubmitting,
  onPrevious,
  onNext,
  onSkipAndSubmit,
  onSubmit,
  isStepValid
}: WizardNavigationProps) => {
  return (
    <div className="flex justify-between mt-8">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 1 || isSubmitting}
      >
        Previous
      </Button>
      
      <div className="flex gap-2">
        {currentStep === 3 && (
          <Button
            type="button"
            variant="outline"
            onClick={onSkipAndSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Skip & Submit"}
          </Button>
        )}
        
        {currentStep < totalSteps ? (
          <Button
            type="button"
            onClick={onNext}
            className="bg-bjj-gold hover:bg-bjj-gold-dark"
            disabled={!isStepValid || isSubmitting}
          >
            Next Step
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onSubmit}
            className="bg-bjj-gold hover:bg-bjj-gold-dark"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Profile"}
          </Button>
        )}
      </div>
    </div>
  );
};
