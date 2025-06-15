
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { useStudentSync } from "@/hooks/useStudentSync";

interface StudentAuthValidationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

export const StudentAuthValidationDialog = ({
  open,
  onOpenChange,
  onComplete,
}: StudentAuthValidationDialogProps) => {
  const [validationResults, setValidationResults] = useState<any[]>([]);
  const [syncResults, setSyncResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { syncStudentAuthLinks, validateStudentAuthLinks, loading } = useStudentSync();

  useEffect(() => {
    if (open) {
      handleValidate();
    }
  }, [open]);

  const handleValidate = async () => {
    try {
      const results = await validateStudentAuthLinks();
      setValidationResults(results);
      setShowResults(true);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleSync = async () => {
    try {
      const results = await syncStudentAuthLinks();
      setSyncResults(results);
      // Re-validate after sync
      await handleValidate();
      onComplete?.();
    } catch (error) {
      console.error("Sync failed:", error);
    }
  };

  const issuesCount = validationResults.filter(r => r.issue_description !== 'OK').length;
  const canAutoFix = validationResults.filter(r => r.issue_description === 'Missing auth_user_id link').length;

  const getStatusIcon = (issue: string) => {
    switch (issue) {
      case 'OK':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Missing auth_user_id link':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'No auth account exists':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusBadge = (issue: string) => {
    switch (issue) {
      case 'OK':
        return <Badge variant="default" className="bg-green-100 text-green-800">OK</Badge>;
      case 'Missing auth_user_id link':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Can Auto-Fix</Badge>;
      case 'No auth account exists':
        return <Badge variant="destructive">Missing Account</Badge>;
      default:
        return <Badge variant="destructive">Error</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Student Auth Account Validation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{validationResults.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Issues Found</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{issuesCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Auto-Fixable</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{canAutoFix}</div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={handleValidate} disabled={loading} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Re-validate
            </Button>
            
            {canAutoFix > 0 && (
              <Button onClick={handleSync} disabled={loading}>
                Auto-Fix {canAutoFix} Student{canAutoFix > 1 ? 's' : ''}
              </Button>
            )}
          </div>

          {/* Sync Results */}
          {syncResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Sync Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-700">
                  Successfully linked {syncResults.length} student(s) to their auth accounts.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Validation Results Table */}
          {showResults && (
            <Card>
              <CardHeader>
                <CardTitle>Validation Results</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Auth Account</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Issue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {validationResults.map((result) => (
                      <TableRow key={result.student_id}>
                        <TableCell className="font-medium">{result.student_name}</TableCell>
                        <TableCell className="text-sm text-gray-600">{result.student_email}</TableCell>
                        <TableCell>
                          {result.has_auth_account ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Yes
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <XCircle className="h-3 w-3 mr-1" />
                              No
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(result.issue_description)}
                            {getStatusBadge(result.issue_description)}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {result.issue_description}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
