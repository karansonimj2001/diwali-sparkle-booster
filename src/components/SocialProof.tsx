import { Star, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const SocialProof = () => {
  const reviews = [
    {
      name: "Rajesh Kumar",
      location: "Mumbai",
      rating: 5,
      text: "Gifted these to my mother last Diwali. She absolutely loved them! Still wearing them regularly and they look as good as new.",
      badge: "Verified Buyer",
      isVideo: false,
    },
    {
      name: "Priya Sharma",
      location: "Delhi",
      rating: 5,
      text: "Beautiful earrings! The packaging was so elegant, I didn't need to wrap them separately. Perfect Diwali gift for my sister.",
      badge: "Verified Buyer",
      isVideo: false,
    },
    {
      name: "Amit Patel",
      location: "Ahmedabad",
      rating: 5,
      text: "My wife was thrilled! The quality is excellent and the tarnish-resistant coating really works. Worth every rupee.",
      badge: "Verified Buyer",
      isVideo: true,
    },
    {
      name: "Meera Reddy",
      location: "Bangalore",
      rating: 5,
      text: "Ordered for my daughter. She has sensitive ears and these are perfect! No irritation at all. Beautiful design too.",
      badge: "Verified Buyer",
      isVideo: false,
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loved by 1,000+ Happy Customers
          </h2>
          <div className="flex items-center justify-center gap-2 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 fill-primary text-primary" />
            ))}
          </div>
          <p className="text-muted-foreground">4.9/5 rating from verified buyers</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {reviews.map((review, index) => (
            <Card key={index} className="shadow-card hover:shadow-warm transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  {review.isVideo && (
                    <div className="bg-primary/10 text-primary rounded-full p-1">
                      <Play className="h-3 w-3" />
                    </div>
                  )}
                </div>
                
                <p className="text-sm mb-4 line-clamp-4">{review.text}</p>
                
                <div className="border-t border-border pt-4">
                  <p className="font-semibold text-sm">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.location}</p>
                  <span className="inline-block mt-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {review.badge}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
