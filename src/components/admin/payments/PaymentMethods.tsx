
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  CreditCard, 
  Smartphone, 
  Building, 
  DollarSign,
  Settings,
  Plus,
  Eye,
  MoreHorizontal
} from "lucide-react";

export const PaymentMethods = () => {
  const paymentMethods = [
    {
      id: "stripe",
      name: "Stripe",
      type: "Credit Cards",
      icon: CreditCard,
      status: "active",
      transactions: 1247,
      revenue: "$45,892",
      fees: "2.9% + $0.30",
      enabled: true
    },
    {
      id: "paypal",
      name: "PayPal",
      type: "Digital Wallet",
      icon: Smartphone,
      status: "active",
      transactions: 324,
      revenue: "$12,450",
      fees: "3.49% + $0.49",
      enabled: true
    },
    {
      id: "bank_transfer",
      name: "Bank Transfer",
      type: "Direct Transfer",
      icon: Building,
      status: "inactive",
      transactions: 45,
      revenue: "$2,890",
      fees: "1.5%",
      enabled: false
    },
    {
      id: "pix",
      name: "PIX",
      type: "Instant Payment",
      icon: DollarSign,
      status: "active",
      transactions: 189,
      revenue: "$8,920",
      fees: "0.99%",
      enabled: true
    }
  ];

  const paymentGateways = [
    {
      name: "Stripe Gateway",
      status: "connected",
      lastSync: "2 minutes ago",
      webhookStatus: "healthy",
      apiVersion: "2023-10-16"
    },
    {
      name: "PayPal Gateway",
      status: "connected",
      lastSync: "5 minutes ago",
      webhookStatus: "healthy",
      apiVersion: "v2"
    },
    {
      name: "Mercado Pago",
      status: "disconnected",
      lastSync: "Never",
      webhookStatus: "inactive",
      apiVersion: "v1"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "connected":
      case "healthy": 
        return "bg-green-100 text-green-800";
      case "inactive":
      case "disconnected": 
        return "bg-red-100 text-red-800";
      default: 
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Methods Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-bjj-navy">Payment Methods</CardTitle>
            <Button className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy">
              <Plus className="h-4 w-4 mr-2" />
              Add Method
            </Button>
          </div>
          <p className="text-sm text-bjj-gray">Configure and manage payment processing methods</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {paymentMethods.map((method) => (
              <div key={method.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <method.icon className="h-6 w-6 text-bjj-navy" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-bjj-navy">{method.name}</h3>
                      <p className="text-sm text-bjj-gray">{method.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(method.status)}>
                      {method.status}
                    </Badge>
                    <Switch checked={method.enabled} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-bjj-gray">Transactions</p>
                    <p className="font-semibold text-bjj-navy">{method.transactions}</p>
                  </div>
                  <div>
                    <p className="text-bjj-gray">Revenue</p>
                    <p className="font-semibold text-bjj-navy">{method.revenue}</p>
                  </div>
                  <div>
                    <p className="text-bjj-gray">Processing Fees</p>
                    <p className="font-semibold text-bjj-navy">{method.fees}</p>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Gateways */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy">Payment Gateways</CardTitle>
          <p className="text-sm text-bjj-gray">Monitor gateway connections and webhook status</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentGateways.map((gateway, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-medium text-bjj-navy">{gateway.name}</h3>
                    <Badge className={getStatusColor(gateway.status)}>
                      {gateway.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-bjj-gray">
                    <div>Last Sync: {gateway.lastSync}</div>
                    <div>Webhook: <span className={`font-medium ${
                      gateway.webhookStatus === 'healthy' ? 'text-green-600' : 'text-red-600'
                    }`}>{gateway.webhookStatus}</span></div>
                    <div>API Version: {gateway.apiVersion}</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    Test
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
