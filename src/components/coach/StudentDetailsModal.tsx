
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Student } from "@/hooks/useStudents";
import { Calendar, Mail, Phone, CreditCard, MapPin } from "lucide-react";

interface StudentDetailsModalProps {
  student: Student | null;
  open: boolean;
  onClose: () => void;
}

export const StudentDetailsModal = ({ student, open, onClose }: StudentDetailsModalProps) => {
  if (!student) return null;

  const getBeltColor = (belt: string) => {
    const colors: Record<string, string> = {
      'White': 'bg-gray-100 text-gray-800',
      'Blue': 'bg-blue-100 text-blue-800',
      'Purple': 'bg-purple-100 text-purple-800',
      'Brown': 'bg-amber-100 text-amber-800',
      'Black': 'bg-gray-900 text-white'
    };
    return colors[belt] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status: string | null) => {
    const colors: Record<string, string> = {
      'paid': 'bg-green-100 text-green-800',
      'unpaid': 'bg-red-100 text-red-800',
      'due_soon': 'bg-yellow-100 text-yellow-800',
      'overdue': 'bg-red-100 text-red-800'
    };
    return colors[status || 'unpaid'] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>{student.name}</span>
            <Badge className={getBeltColor(student.belt)}>
              {student.belt} {student.stripes > 0 && `(${student.stripes} stripes)`}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{student.email}</span>
              </div>
              {student.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{student.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{student.branch}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Academy Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Academy Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Belt Rank</p>
                <p className="font-medium">{student.belt}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Stripes</p>
                <p className="font-medium">{student.stripes}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Coach</p>
                <p className="font-medium">{student.coach}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge className={getBeltColor(student.status)}>
                  {student.status}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Attendance & Performance */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Attendance & Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Attendance Rate</p>
                <p className="font-medium">{student.attendance_rate}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Joined Date</p>
                <p className="font-medium">
                  {new Date(student.joined_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Attended</p>
                <p className="font-medium">
                  {student.last_attended 
                    ? new Date(student.last_attended).toLocaleDateString()
                    : 'Never'
                  }
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Membership & Payment */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Membership & Payment</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Membership Type</p>
                <p className="font-medium">{student.membership_type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Status</p>
                <Badge className={getPaymentStatusColor(student.payment_status)}>
                  {student.payment_status || 'unpaid'}
                </Badge>
              </div>
              {student.next_due_date && (
                <div>
                  <p className="text-sm text-gray-500">Next Due Date</p>
                  <p className="font-medium">
                    {new Date(student.next_due_date).toLocaleDateString()}
                  </p>
                </div>
              )}
              {student.plan_start_date && (
                <div>
                  <p className="text-sm text-gray-500">Plan Start Date</p>
                  <p className="font-medium">
                    {new Date(student.plan_start_date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
