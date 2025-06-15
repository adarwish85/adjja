
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface StudentProfileFormProps {
  data: {
    name: string;
    email: string;
    phone?: string;
    belt?: string;
    branch?: string;
    birthdate?: string;
  };
  onChange: (data: any) => void;
  loading: boolean;
  onSave: () => Promise<void>;
  saveState: "idle" | "saving" | "success" | "error";
}

const belts = ["White", "Blue", "Purple", "Brown", "Black"];

export function StudentProfileForm({
  data,
  onChange,
  loading,
  onSave,
  saveState
}: StudentProfileFormProps) {
  const [local, setLocal] = useState({ ...data });

  // Sync parent changes
  // ...we could add a useEffect for this if needed

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onChange(local);
        onSave();
      }}
      className="w-full bg-white rounded-3xl shadow-lg p-6 md:p-10 mt-6 flex flex-col gap-6"
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="relative">
            <Input
              id="name"
              value={local.name}
              onChange={e => setLocal(prev => ({ ...prev, name: e.target.value }))}
              className="peer border-2 border-gray-200 focus:border-bjj-gold rounded-lg shadow-sm"
              placeholder=" "
              required
            />
            <Label htmlFor="name" className="absolute left-3 top-2 text-gray-400 pointer-events-none peer-focus:text-bjj-gold peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 transition-all">
              Full Name
            </Label>
          </div>
          <div className="relative">
            <Input
              id="email"
              value={local.email}
              onChange={e => setLocal(prev => ({ ...prev, email: e.target.value }))}
              className="peer border-2 border-gray-200 focus:border-bjj-gold rounded-lg shadow-sm"
              placeholder=" "
              required
              type="email"
            />
            <Label htmlFor="email" className="absolute left-3 top-2 text-gray-400 pointer-events-none peer-focus:text-bjj-gold peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 transition-all">
              Email
            </Label>
          </div>
          <div className="relative">
            <Input
              id="phone"
              value={local.phone || ""}
              onChange={e => setLocal(prev => ({ ...prev, phone: e.target.value }))}
              className="peer border-2 border-gray-200 focus:border-bjj-gold rounded-lg shadow-sm"
              placeholder=" "
            />
            <Label htmlFor="phone" className="absolute left-3 top-2 text-gray-400 pointer-events-none peer-focus:text-bjj-gold peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 transition-all">
              Phone Number
            </Label>
          </div>
        </div>
        <div className="space-y-3">
          <div className="relative">
            <select
              id="belt"
              value={local.belt || ""}
              onChange={e => setLocal(prev => ({ ...prev, belt: e.target.value }))}
              className="peer border-2 border-gray-200 focus:border-bjj-gold rounded-lg shadow-sm py-2 px-3 w-full appearance-none"
            >
              <option value="" disabled>Select Belt</option>
              {belts.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <Label htmlFor="belt" className="absolute left-3 top-2 text-gray-400 pointer-events-none peer-focus:text-bjj-gold peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 transition-all">
              Belt Rank
            </Label>
          </div>
          <div className="relative">
            <Input
              id="branch"
              value={local.branch || ""}
              onChange={e => setLocal(prev => ({ ...prev, branch: e.target.value }))}
              className="peer border-2 border-gray-200 focus:border-bjj-gold rounded-lg shadow-sm"
              placeholder=" "
            />
            <Label htmlFor="branch" className="absolute left-3 top-2 text-gray-400 pointer-events-none peer-focus:text-bjj-gold peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 transition-all">
              Branch
            </Label>
          </div>
          <div className="relative">
            <Input
              id="birthdate"
              type="date"
              value={local.birthdate || ""}
              onChange={e => setLocal(prev => ({ ...prev, birthdate: e.target.value }))}
              className="peer border-2 border-gray-200 focus:border-bjj-gold rounded-lg shadow-sm"
              placeholder=" "
            />
            <Label htmlFor="birthdate" className="absolute left-3 top-2 text-gray-400 pointer-events-none peer-focus:text-bjj-gold peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 transition-all">
              Birthdate
            </Label>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          className="font-semibold bg-bjj-gold hover:bg-bjj-gold-dark text-white rounded-lg px-8 py-3 text-lg shadow-lg transition"
          disabled={loading || saveState === "saving"}
        >
          {saveState === "saving" ? "Saving..." : saveState === "success" ? "Saved!" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
