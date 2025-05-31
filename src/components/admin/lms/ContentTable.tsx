
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ContentTableRow } from "./ContentTableRow";
import type { Tables } from "@/integrations/supabase/types";

type ContentLibraryItem = Tables<"content_library">;

interface ContentTableProps {
  items: ContentLibraryItem[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}

export const ContentTable = ({ items, isLoading, onDelete }: ContentTableProps) => {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Content</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Views</TableHead>
            <TableHead>Downloads</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                Loading content...
              </TableCell>
            </TableRow>
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                No content found
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <ContentTableRow
                key={item.id}
                item={item}
                onDelete={onDelete}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
