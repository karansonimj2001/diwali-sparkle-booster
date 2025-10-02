import { Card, CardContent } from "@/components/ui/card";
import packagingBox from "@/assets/packaging-box.jpg";
import { Gift, Package, MessageSquare } from "lucide-react";

const PackagingShowcase = () => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Premium Gift-Ready Packaging
            </h2>
            <p className="text-lg text-muted-foreground">
              No extra effort needed — arrives beautifully presented
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-card">
              <img 
                src={packagingBox}
                alt="Premium gift packaging with orange box, satin pouch and greeting card"
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="space-y-6">
              <Card className="shadow-card border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Elegant Gift Box</h3>
                      <p className="text-muted-foreground">
                        Premium orange & gold box with festive design. Perfect for Diwali gifting without any additional wrapping.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-secondary/10 p-3 rounded-lg">
                      <Gift className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Satin Storage Pouch</h3>
                      <p className="text-muted-foreground">
                        Soft satin pouch to keep earrings safe and tarnish-free. Perfect for travel and daily storage.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-accent/20 p-3 rounded-lg">
                      <MessageSquare className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Handwritten Message Card</h3>
                      <p className="text-muted-foreground">
                        Add a personal touch with your Diwali wishes. We'll handwrite your message on a beautiful greeting card.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackagingShowcase;
