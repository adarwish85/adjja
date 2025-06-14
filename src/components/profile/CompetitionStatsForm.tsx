
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trophy, Medal, Award } from "lucide-react";

interface CompetitionStatsData {
  competitions_count?: number;
  gold_medals?: number;
  silver_medals?: number;
  bronze_medals?: number;
  notable_wins?: string;
}

interface CompetitionStatsFormProps {
  data: CompetitionStatsData;
  onChange: (data: CompetitionStatsData) => void;
}

export const CompetitionStatsForm = ({ data, onChange }: CompetitionStatsFormProps) => {
  const handleChange = (field: keyof CompetitionStatsData, value: string | number) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-bjj-gold" />
          Competition Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Competition Count */}
        <div className="space-y-2">
          <Label htmlFor="competitions">Total Competitions</Label>
          <Input
            id="competitions"
            type="number"
            min="0"
            value={data.competitions_count || ''}
            onChange={(e) => handleChange('competitions_count', parseInt(e.target.value) || 0)}
            placeholder="e.g., 15"
          />
        </div>

        {/* Medal Counts */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gold" className="flex items-center gap-2">
              <Medal className="h-4 w-4 text-yellow-500" />
              Gold Medals
            </Label>
            <Input
              id="gold"
              type="number"
              min="0"
              value={data.gold_medals || ''}
              onChange={(e) => handleChange('gold_medals', parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="silver" className="flex items-center gap-2">
              <Medal className="h-4 w-4 text-gray-400" />
              Silver Medals
            </Label>
            <Input
              id="silver"
              type="number"
              min="0"
              value={data.silver_medals || ''}
              onChange={(e) => handleChange('silver_medals', parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bronze" className="flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-600" />
              Bronze Medals
            </Label>
            <Input
              id="bronze"
              type="number"
              min="0"
              value={data.bronze_medals || ''}
              onChange={(e) => handleChange('bronze_medals', parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
        </div>

        {/* Notable Wins */}
        <div className="space-y-2">
          <Label htmlFor="notable-wins">Notable Wins & Achievements</Label>
          <Textarea
            id="notable-wins"
            rows={4}
            value={data.notable_wins || ''}
            onChange={(e) => handleChange('notable_wins', e.target.value)}
            placeholder="Describe your significant wins, championships, or achievements..."
            maxLength={1000}
          />
          <p className="text-xs text-gray-500">
            {(data.notable_wins || '').length}/1000 characters
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
