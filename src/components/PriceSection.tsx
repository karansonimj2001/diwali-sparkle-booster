import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Gift, Clock, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import UrgencyTimer from "./UrgencyTimer";
import ViewingCount from "./ViewingCount";
import { CheckoutForm, CheckoutFormData } from "./CheckoutForm";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PriceSection = () => {
  const navigate = useNavigate();
  const [giftWrap, setGiftWrap] = useState(true);
  const [hidePrice, setHidePrice] = useState(false);
  const [giftNote, setGiftNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [content, setContent] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadContent();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('pricing-content-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'page_content',
          filter: 'section=eq.pricing'
        },
        () => loadContent()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadContent = async () => {
    const { data } = await supabase
      .from("page_content")
      .select("*")
      .eq("section", "pricing")
      .single();
    
    if (data) setContent(data);
  };

  if (!content) return null;

  const basePrice = content.price || 699;
  const mrp = content.mrp || 999;
  const giftWrapPrice = giftWrap ? (content.gift_wrap_price || 49) : 0;
  const totalPrice = basePrice + giftWrapPrice;
  const savings = mrp - basePrice;

  const handleCheckoutSubmit = (customerData: CheckoutFormData) => {
    setCheckoutOpen(false);
    initiatePayment(customerData);
  };

  const initiatePayment = async (customerData: CheckoutFormData) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          amount: totalPrice,
          currency: 'INR',
          giftWrap,
          giftNote,
          hidePrice,
          customerName: customerData.customerName,
          customerEmail: customerData.customerEmail,
          customerPhone: customerData.customerPhone,
          shippingAddress: customerData.shippingAddress,
          shippingCity: customerData.shippingCity,
          shippingState: customerData.shippingState,
          shippingPincode: customerData.shippingPincode,
        },
      });

      if (error) throw error;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'Diwali Special Earrings',
        description: 'Premium Diwali Gift Set',
        order_id: data.orderId,
        handler: async function (response: any) {
          try {
            const { error: verifyError } = await supabase.functions.invoke('verify-razorpay-payment', {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
            });

            if (verifyError) throw verifyError;

            toast({
              title: "Payment Successful!",
              description: "Redirecting to confirmation...",
            });

            navigate(`/thank-you?orderId=${data.dbOrderId}`);
          } catch (err: any) {
            toast({
              variant: "destructive",
              title: "Payment verification failed",
              description: err.message,
            });
            setLoading(false);
          }
        },
        prefill: {
          name: customerData.customerName,
          email: customerData.customerEmail,
          contact: customerData.customerPhone,
        },
        theme: {
          color: '#FF6B35',
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function () {
        toast({
          variant: "destructive",
          title: "Payment failed",
          description: "Please try again",
        });
        setLoading(false);
      });
      razorpay.open();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to create order",
      });
      setLoading(false);
    }
  };

  return (
    <section id="price-section" className="py-12 md:py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-primary p-6 text-center text-primary-foreground">
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-4">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">{content.subtitle}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                {content.title}
              </h2>
            </div>

            {/* Pricing */}
            <div className="p-6 md:p-8">
              <UrgencyTimer />
              <ViewingCount />
              <div className="text-center mb-8 mt-6">
                <div className="flex items-center justify-center gap-4 mb-2">
                  <span className="text-2xl text-muted-foreground line-through">₹{mrp}</span>
                  <span className="text-5xl font-bold text-primary">₹{basePrice}</span>
                </div>
                <p className="text-lg text-secondary font-semibold">
                  {content.description}
                </p>
              </div>

              {/* Gift Options */}
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-3 p-4 border border-border rounded-lg">
                  <Checkbox 
                    id="gift-wrap" 
                    checked={giftWrap}
                    onCheckedChange={(checked) => setGiftWrap(checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="gift-wrap" className="font-semibold cursor-pointer">
                      Premium Gift Wrap +₹{content.gift_wrap_price}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Beautiful orange & gold festive packaging
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gift-note" className="font-semibold">
                    <Gift className="inline h-4 w-4 mr-2" />
                    Handwritten Message (Free)
                  </Label>
                  <Input 
                    id="gift-note"
                    placeholder="Write your Diwali wishes (max 100 characters)"
                    maxLength={100}
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    {giftNote.length}/100 characters
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox 
                    id="hide-price" 
                    checked={hidePrice}
                    onCheckedChange={(checked) => setHidePrice(checked as boolean)}
                  />
                  <Label htmlFor="hide-price" className="cursor-pointer">
                    Hide price on invoice (for gifting)
                  </Label>
                </div>
              </div>

              {/* Total */}
              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Amount:</span>
                  <span className="text-2xl text-primary">₹{totalPrice}</span>
                </div>
                {giftWrapPrice > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Includes gift wrap (₹{giftWrapPrice})
                  </p>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Button 
                  variant="gradient" 
                  size="xl" 
                  className="w-full"
                  onClick={() => setCheckoutOpen(true)}
                  disabled={loading}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {loading ? "Processing..." : `Buy Now — ₹${totalPrice}`}
                </Button>
                <Button variant="outline" size="lg" className="w-full" disabled={loading}>
                  Add to Cart
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground mt-4">
                {content.content_json?.delivery_note}
              </p>
            </div>
          </div>
        </div>
      </div>

      <CheckoutForm
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        onSubmit={handleCheckoutSubmit}
        isProcessing={loading}
      />
    </section>
  );
};

export default PriceSection;
