
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { usePayments } from "@/hooks/usePayments";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const { verifyPayment } = usePayments();

  useEffect(() => {
    if (sessionId) {
      verifyPayment(sessionId).then((data) => {
        setPaymentStatus(data.status);
      });
    }
  }, [sessionId, verifyPayment]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-bjj-navy">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-bjj-gray">
            Your payment has been processed successfully. You will receive a confirmation email shortly.
          </p>
          {paymentStatus && (
            <p className="text-sm text-bjj-gray">
              Status: <span className="font-medium capitalize">{paymentStatus}</span>
            </p>
          )}
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button 
              onClick={() => navigate("/admin/payments")}
              className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy"
            >
              View Payments
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
