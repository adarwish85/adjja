
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StudentPersonalInfoProps {
  local: any;
  validationErrors: Record<string, string>;
  handleChange: (field: string, value: string) => void;
}

export function StudentPersonalInfo({
  local,
  validationErrors,
  handleChange,
}: StudentPersonalInfoProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          value={local.name}
          onChange={e => handleChange('name', e.target.value)}
          className={`border-2 rounded-lg ${
            validationErrors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-bjj-gold'
          }`}
          required
        />
        {validationErrors.name && (
          <p className="text-xs text-red-500">{validationErrors.name}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={local.email}
          onChange={e => handleChange('email', e.target.value)}
          className={`border-2 rounded-lg ${
            validationErrors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-bjj-gold'
          }`}
          required
        />
        {validationErrors.email && (
          <p className="text-xs text-red-500">{validationErrors.email}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          value={local.phone || ""}
          onChange={e => handleChange('phone', e.target.value)}
          className={`border-2 rounded-lg ${
            validationErrors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-bjj-gold'
          }`}
          placeholder="Enter your phone number"
        />
        {validationErrors.phone && (
          <p className="text-xs text-red-500">{validationErrors.phone}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="birthdate">Date of Birth</Label>
        <Input
          id="birthdate"
          type="date"
          value={local.birthdate || ""}
          onChange={e => handleChange('birthdate', e.target.value)}
          className="border-2 border-gray-200 focus:border-bjj-gold rounded-lg"
        />
      </div>
    </div>
  );
}
