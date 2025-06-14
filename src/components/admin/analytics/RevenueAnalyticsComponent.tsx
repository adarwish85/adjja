
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
         LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { useRevenueAnalytics } from "@/hooks/useRevenueAnalytics";
import { CalendarIcon, DollarSign, CreditCard, TrendingUp, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

export const RevenueAnalyticsComponent = () => {
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({
    start: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    end: new Date()
  });
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  
  const { 
    revenueData, 
    planRevenueData, 
    outstandingPayments, 
    paymentMethodStats,
    isLoading 
  } = useRevenueAnalytics(dateRange);

  const formatDateRange = () => {
    if (dateRange.start && dateRange.end) {
      return `${format(dateRange.start, "MMM dd, yyyy")} - ${format(dateRange.end, "MMM dd, yyyy")}`;
    }
    return "Select date range";
  };

  const totalRevenue = revenueData?.reduce(
    (total, month) => total + Number(month.total_revenue || 0), 0
  ) || 0;

  const totalTransactions = revenueData?.reduce(
    (total, month) => total + (month.transaction_count || 0), 0
  ) || 0;

  const mostPopularPlan = planRevenueData?.[0]?.title || 'N/A';

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse h-80 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="flex justify-end">
        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start text-left font-normal w-[240px]"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formatDateRange()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange.start}
              selected={{ from: dateRange.start, to: dateRange.end }}
              onSelect={(range) => {
                if (range?.from && range?.to) {
                  setDateRange({ start: range.from, end: range.to });
                  setDatePickerOpen(false);
                }
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="p-2 bg-green-100 rounded-full mr-4">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-bjj-gray">Total Revenue</p>
              <h3 className="text-2xl font-bold text-bjj-navy">
                ${totalRevenue.toFixed(2)}
              </h3>
              <p className="text-xs text-bjj-gray">
                In selected period
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="p-2 bg-blue-100 rounded-full mr-4">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-bjj-gray">Transactions</p>
              <h3 className="text-2xl font-bold text-bjj-navy">
                {totalTransactions}
              </h3>
              <p className="text-xs text-bjj-gray">
                Avg ${(totalRevenue / (totalTransactions || 1)).toFixed(2)} per transaction
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="p-2 bg-purple-100 rounded-full mr-4">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-bjj-gray">Popular Plan</p>
              <h3 className="text-xl font-bold text-bjj-navy truncate max-w-[150px]">
                {mostPopularPlan}
              </h3>
              <p className="text-xs text-bjj-gray">
                Most subscribed plan
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="p-2 bg-red-100 rounded-full mr-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-bjj-gray">Outstanding</p>
              <h3 className="text-2xl font-bold text-bjj-navy">
                ${outstandingPayments?.totalOutstanding.toFixed(2) || '0.00'}
              </h3>
              <p className="text-xs text-red-600">
                {outstandingPayments?.countOutstanding || 0} unpaid invoices
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Charts */}
      <Tabs defaultValue="monthly">
        <TabsList className="mb-4">
          <TabsTrigger value="monthly">Monthly Revenue</TabsTrigger>
          <TabsTrigger value="plans">Revenue by Plan</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="outstanding">Outstanding Payments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Revenue']}
                    />
                    <Legend />
                    <Bar 
                      yAxisId="left"
                      dataKey="total_revenue" 
                      name="Revenue" 
                      fill="#8884d8" 
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="transaction_count" 
                      name="Transactions" 
                      stroke="#ff7300" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="plans">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Subscription Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={planRevenueData}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      dataKey="title" 
                      type="category" 
                      width={150}
                      tick={props => {
                        const { x, y, payload } = props;
                        return (
                          <g transform={`translate(${x},${y})`}>
                            <text x={0} y={0} dy={16} textAnchor="end" fill="#666" fontSize={12}>
                              {payload.value}
                            </text>
                            <text x={0} y={0} dy={32} textAnchor="end" fill="#999" fontSize={10}>
                              {planRevenueData?.find(p => p.title === payload.value)?.period}
                            </text>
                          </g>
                        );
                      }}
                    />
                    <Tooltip 
                      formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Revenue']}
                    />
                    <Legend />
                    <Bar dataKey="revenue" name="Total Revenue" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment-methods">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex flex-col justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentMethodStats}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ name, percentage }) => `${name}: ${percentage.toFixed(0)}%`}
                      >
                        {paymentMethodStats?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`${value}`, 'Count']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4">Payment Method Analytics</h4>
                  <div className="space-y-4">
                    {paymentMethodStats?.map(method => (
                      <div key={method.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{method.name}</span>
                          <Badge style={{ backgroundColor: method.color }}>
                            {method.count} transactions
                          </Badge>
                        </div>
                        <div>
                          <div className="text-sm flex justify-between mb-1">
                            <span>Transaction Share</span>
                            <span>{method.percentage.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="rounded-full h-2" 
                              style={{ 
                                width: `${method.percentage}%`,
                                backgroundColor: method.color
                              }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm flex justify-between mb-1">
                            <span>Revenue Share</span>
                            <span>{method.amountPercentage.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="rounded-full h-2" 
                              style={{ 
                                width: `${method.amountPercentage}%`,
                                backgroundColor: method.color
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-sm text-right">
                          Total revenue: ${method.amount.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="outstanding">
          <Card>
            <CardHeader>
              <CardTitle>Outstanding Payments</CardTitle>
            </CardHeader>
            <CardContent>
              {outstandingPayments?.outstandingItems?.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="pb-2 font-semibold">Student</th>
                        <th className="pb-2 font-semibold">Plan</th>
                        <th className="pb-2 font-semibold">Amount</th>
                        <th className="pb-2 font-semibold">Due Date</th>
                        <th className="pb-2 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {outstandingPayments.outstandingItems.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="py-3">{item.students.name}</td>
                          <td className="py-3">{item.subscription_plans.title}</td>
                          <td className="py-3">${item.subscription_plans.standard_price.toFixed(2)}</td>
                          <td className="py-3">{new Date(item.next_due_date).toLocaleDateString()}</td>
                          <td className="py-3">
                            <Badge variant="outline" className="bg-red-100 text-red-800">
                              {item.payment_status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <h3 className="text-lg font-medium mb-2">No Outstanding Payments</h3>
                  <p className="text-sm text-bjj-gray">All payments are up to date!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
