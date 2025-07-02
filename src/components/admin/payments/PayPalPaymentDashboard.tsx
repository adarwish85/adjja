import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Search, Download, DollarSign, Users, AlertTriangle } from "lucide-react";
import { usePaymentTransactions } from "@/hooks/usePaymentTransactions";
import { PaymentTransactionRow } from "./PaymentTransactionRow";

export const PayPalPaymentDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { transactions, isLoading } = usePaymentTransactions();

  const filteredTransactions = transactions?.filter((transaction) => {
    const matchesSearch = 
      transaction.students?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.students?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.paypal_transaction_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = transactions?.reduce((sum, t) => t.status === "completed" ? sum + t.amount : sum, 0) || 0;
  const pendingPayments = transactions?.filter(t => t.status === "pending").length || 0;
  const failedPayments = transactions?.filter(t => t.status === "failed").length || 0;

  const exportToCSV = () => {
    if (!filteredTransactions) return;

    const csvContent = [
      ["Date", "Student", "Email", "Plan", "Amount", "Status", "PayPal Transaction ID"].join(","),
      ...filteredTransactions.map(t => [
        new Date(t.transaction_date).toLocaleDateString(),
        t.students?.name || "",
        t.students?.email || "",
        t.subscription_plans?.title || "Manual Payment",
        t.amount,
        t.status,
        t.paypal_transaction_id || ""
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payment-transactions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bjj-gold"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-bjj-navy">Payment Dashboard</h2>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-bjj-gray">Total Revenue</p>
                <p className="text-2xl font-bold text-bjj-navy">EGP {totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-bjj-gray">Total Transactions</p>
                <p className="text-2xl font-bold text-bjj-navy">{transactions?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-bjj-gray">Pending</p>
                <p className="text-2xl font-bold text-bjj-navy">{pendingPayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-bjj-gray">Failed</p>
                <p className="text-2xl font-bold text-bjj-navy">{failedPayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bjj-gray h-4 w-4" />
                <Input
                  placeholder="Search by student name, email, or transaction ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy">Payment Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTransactions?.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-bjj-gray mx-auto mb-4" />
              <h3 className="text-lg font-medium text-bjj-navy mb-2">No Transactions Found</h3>
              <p className="text-bjj-gray">No payment transactions match your current filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions?.map((transaction) => (
                <PaymentTransactionRow key={transaction.id} transaction={transaction} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
