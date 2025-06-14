
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, CreditCard, TrendingUp, Users, AlertTriangle, Calendar } from "lucide-react";
import { usePaymentTransactions } from "@/hooks/usePaymentTransactions";
import { useSubscriptionPlans } from "@/hooks/useSubscriptionPlans";

export const PaymentsOverview = () => {
  const { transactions, isLoading: transactionsLoading } = usePaymentTransactions();
  const { subscriptionPlans, isLoading: plansLoading } = useSubscriptionPlans();

  if (transactionsLoading || plansLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Calculate metrics
  const totalRevenue = transactions?.reduce((sum, t) => 
    t.status === "completed" ? sum + t.amount : sum, 0
  ) || 0;

  const monthlyRevenue = transactions?.reduce((sum, t) => {
    const transactionDate = new Date(t.transaction_date);
    const now = new Date();
    const isThisMonth = transactionDate.getMonth() === now.getMonth() && 
                       transactionDate.getFullYear() === now.getFullYear();
    return (t.status === "completed" && isThisMonth) ? sum + t.amount : sum;
  }, 0) || 0;

  const totalTransactions = transactions?.length || 0;
  const pendingPayments = transactions?.filter(t => t.status === "pending").length || 0;
  const overdue = transactions?.filter(t => t.status === "failed").length || 0;
  const activePlans = subscriptionPlans?.filter(p => p.is_active).length || 0;

  const recentTransactions = transactions?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-bjj-gray">Total Revenue</p>
                <p className="text-2xl font-bold text-bjj-navy">${totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-bjj-gray">This Month</p>
                <p className="text-2xl font-bold text-bjj-navy">${monthlyRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-bjj-gray">Transactions</p>
                <p className="text-2xl font-bold text-bjj-navy">{totalTransactions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-bjj-gray">Active Plans</p>
                <p className="text-2xl font-bold text-bjj-navy">{activePlans}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-bjj-gray">Pending Payments</p>
                <p className="text-2xl font-bold text-bjj-navy">{pendingPayments}</p>
                <p className="text-xs text-bjj-gray">Awaiting completion</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-bjj-gray">Failed Payments</p>
                <p className="text-2xl font-bold text-bjj-navy">{overdue}</p>
                <p className="text-xs text-bjj-gray">Requires attention</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-bjj-gray">Success Rate</p>
                <p className="text-2xl font-bold text-bjj-navy">
                  {totalTransactions > 0 
                    ? ((totalTransactions - overdue) / totalTransactions * 100).toFixed(1)
                    : 0
                  }%
                </p>
                <p className="text-xs text-bjj-gray">Payment success</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold text-bjj-navy">{transaction.students?.name}</h4>
                    <p className="text-sm text-bjj-gray">
                      {transaction.subscription_plans?.title || "Manual Payment"}
                    </p>
                    <p className="text-xs text-bjj-gray">
                      {new Date(transaction.transaction_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-semibold text-bjj-navy">${transaction.amount.toFixed(2)}</div>
                    <Badge className={
                      transaction.status === "completed" ? "bg-green-100 text-green-800" :
                      transaction.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-bjj-gray mx-auto mb-4" />
              <h3 className="text-lg font-medium text-bjj-navy mb-2">No Transactions Yet</h3>
              <p className="text-bjj-gray">Transactions will appear here once students start making payments.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
