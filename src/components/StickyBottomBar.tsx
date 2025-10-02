import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import productCloseup from "@/assets/product-closeup.jpg";

const StickyBottomBar = () => {
  const scrollToPrice = () => {
    document.getElementById('price-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-2xl">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          <img 
            src={productCloseup}
            alt="Tarnish-resistant earrings"
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="flex-1">
            <p className="font-semibold text-sm">Diwali Special</p>
            <p className="text-primary font-bold">₹699</p>
          </div>
          <Button 
            variant="gradient" 
            size="lg"
            onClick={scrollToPrice}
          >
            <ShoppingCart className="h-4 w-4" />
            Send as Gift
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StickyBottomBar;
