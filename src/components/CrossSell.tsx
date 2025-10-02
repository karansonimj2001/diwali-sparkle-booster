import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Gift } from "lucide-react";

const CrossSell = () => {
  return (
    <section className="py-12 md:py-16 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Complete Your Diwali Gift
            </h2>
            <p className="text-lg text-muted-foreground">
              Make it extra special with these add-ons
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-card hover:shadow-warm transition-all border-2 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Gift className="h-6 w-6 text-primary" />
                  </div>
                  <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    Popular
                  </span>
                </div>
                
                <h3 className="text-xl font-bold mb-2">
                  Premium Gift Set Upgrade
                </h3>
                <p className="text-muted-foreground mb-4">
                  Add matching velvet pouch + personalized Diwali card with metallic gold accents
                </p>
                
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-primary">₹99</span>
                  <span className="text-muted-foreground line-through">₹199</span>
                  <span className="text-sm text-secondary font-semibold">(50% off)</span>
                </div>

                <Button variant="gradient" className="w-full">
                  <Plus className="h-4 w-4" />
                  Add to Order
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-warm transition-all border-2 border-accent/20">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-accent/20 p-3 rounded-lg">
                    <Plus className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <span className="bg-accent/20 text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    Best Value
                  </span>
                </div>
                
                <h3 className="text-xl font-bold mb-2">
                  Buy 2, Save 20%
                </h3>
                <p className="text-muted-foreground mb-4">
                  Perfect for gifting to both mom and sister. Get 2 complete sets at discounted price
                </p>
                
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-primary">₹1,118</span>
                  <span className="text-muted-foreground line-through">₹1,398</span>
                  <span className="text-sm text-secondary font-semibold">(Save ₹280)</span>
                </div>

                <Button variant="gold" className="w-full">
                  <Plus className="h-4 w-4" />
                  Add Second Set
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              ⚡ Limited time Diwali offers — valid until 25th October
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CrossSell;
