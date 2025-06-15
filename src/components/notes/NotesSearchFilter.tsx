
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface NotesSearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  allTags: string[];
}

export const NotesSearchFilter = ({
  searchQuery,
  setSearchQuery,
  selectedTag,
  setSelectedTag,
  allTags
}: NotesSearchFilterProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bjj-gray h-4 w-4" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedTag === "" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag("")}
            >
              All
            </Button>
            {allTags.map(tag => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
