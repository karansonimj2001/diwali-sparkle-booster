import { Shield, Heart, Gift, RotateCcw, Smartphone } from "lucide-react";

const BenefitsStrip = () => {
  const benefits = [
    { icon: Shield, text: "Tarnish-resistant" },
    { icon: Heart, text: "Hypoallergenic" },
    { icon: Gift, text: "Gift box included" },
    { icon: RotateCcw, text: "30-day returns" },
    { icon: Smartphone, text: "COD & UPI" },
  ];

  return (
    <section className="py-8 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 text-sm md:text-base"
            >
              <benefit.icon className="h-5 w-5 text-primary" />
              <span className="font-medium">{benefit.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsStrip;
