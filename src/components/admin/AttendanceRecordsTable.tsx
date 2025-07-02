
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Search, Filter, Calendar, User, Clock } from "lucide-react";

interface AttendanceRecord {
  id: string;
  student_id: string;
  class_id: string;
  attendance_date: string;
  status: string;
  marked_at: string;
  checked_in_by: string | null;
  source: string | null;
  students: {
    name: string;
    email: string;
  } | null;
  classes: {
    name: string;
    instructor: string;
  } | null;
  marked_by_profile?: {
    name: string;
  } | null;
}

interface AttendanceRecordsTableProps {
  refreshTrigger?: number;
}

export const AttendanceRecordsTable = ({ refreshTrigger }: AttendanceRecordsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("today");

  const { data: attendanceRecords, isLoading, refetch } = useQuery({
    queryKey: ['attendance-records', refreshTrigger, dateFilter, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('attendance_records')
        .select(`
          *,
          students(name, email),
          classes(name, instructor),
          marked_by_profile:profiles!attendance_records_marked_by_fkey(name)
        `)
        .order('marked_at', { ascending: false });

      // Apply date filter
      const today = new Date().toISOString().split('T')[0];
      if (dateFilter === 'today') {
        query = query.eq('attendance_date', today);
      } else if (dateFilter === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        query = query.gte('attendance_date', weekAgo.toISOString().split('T')[0]);
      }

      // Apply status filter
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query.limit(100);
      if (error) {
        console.error('Error fetching attendance records:', error);
        throw error;
      }
      return data || [];
    }
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('attendance-records-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'attendance_records'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const filteredRecords = attendanceRecords?.filter(record => {
    if (!record.students) return false;
    return record.students.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (record.classes?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
  }) || [];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      present: { color: "bg-green-500", label: "Present" },
      late: { color: "bg-orange-500", label: "Late" },
      absent: { color: "bg-red-500", label: "Absent" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { color: "bg-gray-500", label: status };
    
    return (
      <Badge className={`${config.color} text-white`}>
        {config.label}
      </Badge>
    );
  };

  const getSourceBadge = (source: string | null) => {
    if (source === 'self') {
      return <Badge variant="outline" className="text-blue-600">Self Check-in</Badge>;
    }
    return <Badge variant="outline" className="text-gray-600">Manual</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Attendance Records
        </CardTitle>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search students or classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="present">Present</SelectItem>
              <SelectItem value="late">Late</SelectItem>
              <SelectItem value="absent">Absent</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bjj-red"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Marked By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No attendance records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-semibold">{record.students?.name || 'Unknown Student'}</p>
                          <p className="text-sm text-gray-500">{record.students?.email || 'No email'}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{record.classes?.name || 'Unknown Class'}</p>
                          <p className="text-sm text-gray-500">{record.classes?.instructor || 'No instructor'}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(record.attendance_date), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        {format(new Date(record.marked_at), 'HH:mm')}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(record.status)}
                      </TableCell>
                      <TableCell>
                        {getSourceBadge(record.source)}
                      </TableCell>
                      <TableCell>
                        {record.marked_by_profile?.name || 'System'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
