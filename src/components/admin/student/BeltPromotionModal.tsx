
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Belt =
  | "White Belt"
  | "Blue Belt"
  | "Purple Belt"
  | "Brown Belt"
  | "Black Belt";

interface BeltPromotionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBelt: Belt;
  currentStripes: number;
  onPromote: (newBelt: Belt, newStripes: number, note?: string) => void;
  loading?: boolean;
}

const BELT_ORDER: Belt[] = [
  "White Belt",
  "Blue Belt",
  "Purple Belt",
  "Brown Belt",
  "Black Belt",
];

const MAX_STRIPES = 4;

export const BeltPromotionModal: React.FC<BeltPromotionModalProps> = ({
  open,
  onOpenChange,
  currentBelt,
  currentStripes,
  onPromote,
  loading = false,
}) => {
  const [newBelt, setNewBelt] = useState<Belt>(currentBelt);
  const [newStripes, setNewStripes] = useState<number>(currentStripes);
  const [note, setNote] = useState<string>("");

  // Helper for belt progression control
  const currentBeltIndex = BELT_ORDER.indexOf(currentBelt);
  const nextBelts = BELT_ORDER.slice(currentBeltIndex);

  // Validation - Can only promote forward (never backward)
  const isValidPromotion =
    (newBelt === currentBelt && newStripes > currentStripes && newStripes <= MAX_STRIPES) ||
    (BELT_ORDER.indexOf(newBelt) === currentBeltIndex + 1 && newStripes === 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPromotion) return;
    onPromote(newBelt, newStripes, note || undefined);
    setNote("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Belt Promotion</DialogTitle>
          <DialogDescription>
            Promote the student to a higher belt and/or add stripes. You can promote up to 4 stripes before the next belt.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium">Current Belt</label>
            <Badge>
              {currentBelt}, {currentStripes} stripe{currentStripes !== 1 ? "s" : ""}
            </Badge>
          </div>
          <div>
            <label className="block text-sm font-medium">Promote to Belt</label>
            <select
              value={newBelt}
              onChange={e => setNewBelt(e.target.value as Belt)}
              className="block w-full mt-1 rounded border px-3 py-2"
            >
              {nextBelts.map(belt => (
                <option key={belt} value={belt}>{belt}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Stripes</label>
            <Input
              type="number"
              min={0}
              max={MAX_STRIPES}
              value={newStripes}
              onChange={e => setNewStripes(Number(e.target.value))}
              className="w-20"
            />
            <span className="ml-2 text-sm text-gray-500">(0 to {MAX_STRIPES} stripes)</span>
          </div>
          <div>
            <label className="block text-sm font-medium">Promotion Note (optional)</label>
            <Input
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Add a note for this promotion"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="bg-bjj-gold text-bjj-navy" disabled={!isValidPromotion || loading}>
              {loading ? "Promoting..." : "Confirm Promotion"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
