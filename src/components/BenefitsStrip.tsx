import { Shield, Heart, Gift, RotateCcw, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import * as LucideIcons from "lucide-react";

const BenefitsStrip = () => {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    loadContent();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('benefits-content-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'page_content',
          filter: 'section=eq.benefits'
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
      .eq("section", "benefits")
      .single();
    
    if (data) setContent(data);
  };

  if (!content?.content_json?.items) return null;

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon || Shield;
  };

  return (
    <section className="py-8 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
          {content.content_json.items.map((benefit: any, index: number) => {
            const IconComponent = getIcon(benefit.icon);
            return (
              <div 
                key={index}
                className="flex items-center gap-2 text-sm md:text-base"
              >
                <IconComponent className="h-5 w-5 text-primary" />
                <span className="font-medium">{benefit.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BenefitsStrip;
