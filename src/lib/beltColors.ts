
/**
 * Returns the Tailwind color classes for the current belt.
 */
export function getBeltColor(belt?: string) {
  if (!belt) return "bg-gray-200 text-gray-900 border-gray-200";
  const b = belt.toLowerCase();
  if (b.includes("white")) return "bg-gray-100 text-gray-900 border-gray-200";
  if (b.includes("blue")) return "bg-blue-600 text-white border-blue-700";
  if (b.includes("purple")) return "bg-purple-600 text-white border-purple-700";
  if (b.includes("brown")) return "bg-amber-800 text-white border-amber-900";
  if (b.includes("black")) return "bg-gray-900 text-white border-gray-800";
  return "bg-blue-600 text-white border-blue-700";
}
