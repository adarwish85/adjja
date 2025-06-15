
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ChangePasswordSection({
  onChangePassword,
  loading,
  saveState
}: {
  onChangePassword: (oldPass: string, newPass: string) => Promise<void>;
  loading: boolean;
  saveState: "idle" | "saving" | "success" | "error";
}) {
  const [open, setOpen] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");
  const [err, setErr] = useState<string>("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!oldPass || !newPass) return setErr("All fields required");
    if (newPass !== confirmNewPass) return setErr("Passwords do not match");
    await onChangePassword(oldPass, newPass);
  };

  return (
    <div className="mt-8 rounded-2xl bg-gradient-to-r from-yellow-50 to-amber-100/70 p-6 shadow border border-amber-100">
      <button
        className="text-bjj-gold font-semibold mb-4 underline underline-offset-4"
        onClick={() => setOpen(v => !v)}
        type="button"
      >
        {open ? "Hide Change Password ▲" : "Change Password ▼"}
      </button>
      {open && (
        <form className="flex flex-col gap-3 mt-2" onSubmit={handleSave}>
          <Input
            type="password"
            placeholder="Current Password"
            value={oldPass}
            onChange={e => setOldPass(e.target.value)}
            autoComplete="current-password"
          />
          <Input
            type="password"
            placeholder="New Password"
            value={newPass}
            onChange={e => setNewPass(e.target.value)}
            autoComplete="new-password"
          />
          <Input
            type="password"
            placeholder="Confirm New Password"
            value={confirmNewPass}
            onChange={e => setConfirmNewPass(e.target.value)}
            autoComplete="new-password"
          />
          {err && <div className="text-red-500 text-sm">{err}</div>}
          <Button
            type="submit"
            className="bg-bjj-navy text-white rounded px-4 py-2 mt-2"
            disabled={loading || saveState === "saving"}
          >
            {saveState === "saving" ? "Saving..." : saveState === "success" ? "Changed!" : "Save Password"}
          </Button>
        </form>
      )}
    </div>
  );
}
