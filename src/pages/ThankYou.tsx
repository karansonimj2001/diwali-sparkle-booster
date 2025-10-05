import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Package, Mail, Phone, MapPin, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface OrderDetails {
  id: string;
  amount: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_pincode: string;
  gift_wrap: boolean;
  gift_note: string | null;
  hide_price: boolean;
  created_at: string;
}

export default function ThankYou() {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const orderId = searchParams.get("orderId");
      if (!orderId) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .maybeSingle();

      if (!error && data) {
        setOrder(data);
      }
      setLoading(false);
    };

    fetchOrder();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <h1 className="text-2xl font-bold">Order Not Found</h1>
        <p className="text-muted-foreground">We couldn't find your order details.</p>
        <Button asChild>
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-6">
              <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-500" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Order Confirmed!</h1>
          <p className="text-lg text-muted-foreground">
            Thank you for your purchase, {order.customer_name}
          </p>
          <p className="text-sm text-muted-foreground">
            Order ID: <span className="font-mono font-semibold">{order.id}</span>
          </p>
        </div>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="text-2xl font-bold">₹{order.amount}</span>
            </div>
            
            {order.gift_wrap && (
              <>
                <Separator />
                <div className="space-y-2">
                  <p className="font-medium">Gift Options</p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>✓ Premium Gift Wrapping</p>
                    {order.gift_note && <p>✓ Handwritten Message</p>}
                    {order.hide_price && <p>✓ Price Hidden on Invoice</p>}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Shipping Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Shipping Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <p className="font-medium">{order.customer_name}</p>
              <p className="text-sm text-muted-foreground">{order.shipping_address}</p>
              <p className="text-sm text-muted-foreground">
                {order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}
              </p>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{order.customer_email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{order.customer_phone}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Info */}
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <h3 className="font-semibold">What's Next?</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>✓ You'll receive an order confirmation email at {order.customer_email}</li>
                <li>✓ We'll send you tracking details once your order ships</li>
                <li>✓ Expected delivery: 5-7 business days</li>
                <li>✓ Need help? Contact our support team</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="outline">
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
