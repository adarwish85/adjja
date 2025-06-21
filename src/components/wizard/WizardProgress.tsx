
import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";

interface Step {
  id: number;
  title: string;
  description: string;
}

interface WizardProgressProps {
  steps: Step[];
  currentStep: number;
}

export const WizardProgress = ({ steps, currentStep }: WizardProgressProps) => {
  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step.id <= currentStep 
                ? 'bg-bjj-gold text-white' 
                : 'bg-gray-200 text-gray-500'
            }`}>
              {step.id < currentStep ? <CheckCircle className="w-5 h-5" /> : step.id}
            </div>
            <span className="text-xs text-gray-600 mt-1 text-center">{step.title}</span>
          </div>
        ))}
      </div>
      <Progress value={progress} className="w-full" />
    </div>
  );
};
