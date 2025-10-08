import { Card, CardContent } from "@/components/ui/card";
import defaultPackagingBox from "@/assets/packaging-box.jpg";
import { Gift, Package, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import * as LucideIcons from "lucide-react";

const PackagingShowcase = () => {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    loadContent();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('packaging-content-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'page_content',
          filter: 'section=eq.packaging'
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
      .eq("section", "packaging")
      .maybeSingle();
    
    if (data) setContent(data);
  };

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon || Package;
  };

  if (!content) return null;

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {content.title}
            </h2>
            <p className="text-lg text-muted-foreground">
              {content.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-card">
              <img 
                src={content.content_json?.image_url || content.image_url || defaultPackagingBox}
                alt="Premium gift packaging with orange box, satin pouch and greeting card"
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="space-y-6">
              {content.content_json?.features?.map((feature: any, index: number) => {
                const IconComponent = getIcon(feature.icon);
                return (
                  <Card key={index} className="shadow-card border-primary/20">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                          <p className="text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackagingShowcase;
