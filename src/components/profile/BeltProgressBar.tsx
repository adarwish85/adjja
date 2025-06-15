
interface BeltProgressBarProps {
  belt: string;
  stripes: number;
}

const beltLevels: Record<string, { maxStripes: number; color: string }> = {
  "White": { maxStripes: 4, color: "from-gray-200 to-gray-400" },
  "Blue": { maxStripes: 4, color: "from-blue-300 to-blue-700" },
  "Purple": { maxStripes: 4, color: "from-purple-300 to-purple-700" },
  "Brown": { maxStripes: 4, color: "from-amber-300 to-amber-800" },
  "Black": { maxStripes: 6, color: "from-gray-600 to-gray-900" },
};

export function BeltProgressBar({ belt, stripes }: BeltProgressBarProps) {
  const normalizedBelt = (belt || "").toLowerCase();
  const entry = Object.entries(beltLevels).find(([k]) => k.toLowerCase() === normalizedBelt);
  if (!entry) return null;
  const { maxStripes, color } = entry[1];
  const progress = Math.min((stripes / maxStripes) * 100, 100);

  return (
    <div className="w-full mt-4">
      <div className="flex justify-between text-xs text-gray-500 mb-1 px-1">
        <span>{belt} belt</span>
        <span>{stripes}/{maxStripes} Stripes</span>
      </div>
      <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden shadow-inner">
        <div
          className={`h-3 rounded-full bg-gradient-to-r ${color} transition-all`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
