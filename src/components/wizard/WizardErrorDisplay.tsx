
interface WizardErrorDisplayProps {
  error: string;
}

export const WizardErrorDisplay = ({ error }: WizardErrorDisplayProps) => {
  if (!error) return null;

  return (
    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-red-700 text-sm font-medium">Submission Error:</p>
      <p className="text-red-600 text-sm mt-1">{error}</p>
    </div>
  );
};
