
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Database, CheckCircle, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SyncResult {
  user_id: string;
  user_name: string;
  action_taken: string;
}

export const DataSyncUtility = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [syncResults, setSyncResults] = useState<SyncResult[]>([]);
  const [hasRun, setHasRun] = useState(false);

  const handleSyncExistingUsers = async () => {
    setIsRunning(true);
    try {
      const { data, error } = await supabase.rpc('sync_existing_user_approvals');
      
      if (error) {
        console.error('Sync error:', error);
        toast.error("Failed to sync existing users");
        return;
      }

      setSyncResults(data || []);
      setHasRun(true);
      
      if (data && data.length > 0) {
        toast.success(`Successfully synced ${data.length} existing users`);
      } else {
        toast.success("All existing users are already properly synced");
      }
    } catch (error) {
      console.error('Sync error:', error);
      toast.error("Failed to sync existing users");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-bjj-navy flex items-center gap-2">
          <Database className="h-5 w-5" />
          Data Sync Utility
        </CardTitle>
        <p className="text-sm text-bjj-gray">
          Sync existing users with the new approval workflow
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This utility will automatically approve users who already have active student records 
            but are still marked as pending approval. This fixes the data inconsistency issue.
          </AlertDescription>
        </Alert>

        <Button
          onClick={handleSyncExistingUsers}
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Syncing Users...
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              Sync Existing Users
            </>
          )}
        </Button>

        {hasRun && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Sync Complete</span>
            </div>
            
            {syncResults.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-bjj-gray">
                  {syncResults.length} users were auto-approved:
                </p>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {syncResults.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{result.user_name}</span>
                      <Badge variant="outline" className="text-xs">
                        {result.action_taken.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-bjj-gray">
                No users needed syncing. All data is consistent.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
