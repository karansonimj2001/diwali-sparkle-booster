import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import defaultHeroImage from "@/assets/hero-gifting.jpg";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const HeroSection = () => {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const { data } = await supabase
      .from("page_content")
      .select("*")
      .eq("section", "hero")
      .single();
    
    if (data) setContent(data);
  };

  const scrollToPrice = () => {
    document.getElementById('price-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!content) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Hero Image */}
          <div className="order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-card">
              <img 
                src={content.image_url || defaultHeroImage} 
                alt="Brother gifting earrings to mother during Diwali celebration"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>

          {/* Hero Content */}
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent-foreground px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">{content.content_json?.badge_text}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {content.title}
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-4">
              {content.subtitle}
            </p>
            <p className="text-base text-muted-foreground mb-8">
              {content.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                variant="gradient" 
                size="xl"
                onClick={scrollToPrice}
                className="group"
              >
                {content.button_text}
                <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="xl"
                onClick={scrollToPrice}
              >
                {content.content_json?.secondary_button}
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground">
              {content.content_json?.benefits?.map((benefit: string, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
