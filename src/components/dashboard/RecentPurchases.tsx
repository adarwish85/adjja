
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const recentPurchases = [
  {
    id: 1,
    student: "Carlos Mendes",
    course: "Guard Fundamentals",
    amount: "$49.99",
    date: "2 hours ago",
    status: "completed",
  },
  {
    id: 2,
    student: "Ana Silva",
    course: "Submission Escapes",
    amount: "$39.99",
    date: "5 hours ago",
    status: "completed",
  },
  {
    id: 3,
    student: "Roberto Santos",
    course: "Advanced Sweeps",
    amount: "$59.99",
    date: "1 day ago",
    status: "pending",
  },
  {
    id: 4,
    student: "Maria Costa",
    course: "Basic Positions",
    amount: "$29.99",
    date: "2 days ago",
    status: "completed",
  },
];

export const RecentPurchases = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-bjj-navy">Recent LMS Purchases</CardTitle>
        <p className="text-sm text-bjj-gray">Latest course purchases and enrollments</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentPurchases.map((purchase) => (
            <div key={purchase.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <h4 className="font-semibold text-bjj-navy">{purchase.student}</h4>
                <p className="text-sm text-bjj-gray">{purchase.course}</p>
                <p className="text-xs text-bjj-gray">{purchase.date}</p>
              </div>
              <div className="text-right space-y-1">
                <div className="font-semibold text-bjj-navy">{purchase.amount}</div>
                <Badge className={getStatusColor(purchase.status)}>
                  {purchase.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
