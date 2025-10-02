import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Gift, Clock, ShoppingCart } from "lucide-react";

const PriceSection = () => {
  const [giftWrap, setGiftWrap] = useState(true);
  const [hidePrice, setHidePrice] = useState(false);
  const [giftNote, setGiftNote] = useState("");

  const basePrice = 699;
  const mrp = 999;
  const giftWrapPrice = giftWrap ? 49 : 0;
  const totalPrice = basePrice + giftWrapPrice;
  const savings = mrp - basePrice;

  return (
    <section id="price-section" className="py-12 md:py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-primary p-6 text-center text-primary-foreground">
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-4">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Only 47 Diwali Gift Kits left</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                Special Diwali Pricing
              </h2>
            </div>

            {/* Pricing */}
            <div className="p-6 md:p-8">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-4 mb-2">
                  <span className="text-2xl text-muted-foreground line-through">₹{mrp}</span>
                  <span className="text-5xl font-bold text-primary">₹{basePrice}</span>
                </div>
                <p className="text-lg text-secondary font-semibold">
                  Save ₹{savings} (30% off)
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
                      Premium Gift Wrap +₹{49}
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
                <Button variant="gradient" size="xl" className="w-full">
                  <ShoppingCart className="h-5 w-5" />
                  Buy Now — ₹{totalPrice}
                </Button>
                <Button variant="outline" size="lg" className="w-full">
                  Add to Cart
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground mt-4">
                Free delivery across India • Secure payment
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceSection;
