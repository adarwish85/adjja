
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Eye, 
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle
} from "lucide-react";

export const TransactionManagement = () => {
  const transactions = [
    {
      id: "TXN-2024-001",
      customer: "João Silva",
      email: "joao@email.com",
      amount: "$49.99",
      status: "completed",
      method: "Credit Card",
      type: "subscription",
      date: "2024-01-15",
      time: "14:30"
    },
    {
      id: "TXN-2024-002",
      customer: "Maria Santos",
      email: "maria@email.com",
      amount: "$29.99",
      status: "pending",
      method: "PayPal",
      type: "one-time",
      date: "2024-01-15",
      time: "13:45"
    },
    {
      id: "TXN-2024-003",
      customer: "Carlos Mendes",
      email: "carlos@email.com",
      amount: "$79.99",
      status: "completed",
      method: "Credit Card",
      type: "course",
      date: "2024-01-14",
      time: "16:20"
    },
    {
      id: "TXN-2024-004",
      customer: "Ana Costa",
      email: "ana@email.com",
      amount: "$19.99",
      status: "failed",
      method: "Bank Transfer",
      type: "merchandise",
      date: "2024-01-14",
      time: "11:10"
    },
    {
      id: "TXN-2024-005",
      customer: "Roberto Lima",
      email: "roberto@email.com",
      amount: "$99.99",
      status: "refunded",
      method: "Credit Card",
      type: "subscription",
      date: "2024-01-13",
      time: "09:30"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending": return <Clock className="h-4 w-4 text-yellow-600" />;
      case "failed": return <XCircle className="h-4 w-4 text-red-600" />;
      case "refunded": return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default: return <RefreshCw className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "failed": return "bg-red-100 text-red-800";
      case "refunded": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "subscription": return "bg-blue-100 text-blue-800";
      case "course": return "bg-purple-100 text-purple-800";
      case "merchandise": return "bg-green-100 text-green-800";
      case "one-time": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy">Transaction Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by customer, email, or transaction ID..."
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy">All Transactions</CardTitle>
          <p className="text-sm text-bjj-gray">Manage and view all payment transactions</p>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {transaction.id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{transaction.customer}</div>
                        <div className="text-sm text-bjj-gray">{transaction.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {transaction.amount}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(transaction.status)}
                        <Badge variant="outline" className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getTypeColor(transaction.type)}>
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.method}</TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{transaction.date}</div>
                        <div className="text-xs text-bjj-gray">{transaction.time}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
