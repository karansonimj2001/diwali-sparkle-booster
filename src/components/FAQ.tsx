import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const FAQ = () => {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    loadContent();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('faq-content-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'page_content',
          filter: 'section=eq.faq'
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
      .eq("section", "faq")
      .single();
    
    if (data) setContent(data);
  };

  if (!content) return null;

  return (
    <section className="py-12 md:py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {content.title}
          </h2>

          <Accordion type="single" collapsible className="space-y-4">
            {content.content_json?.items?.map((faq: any, index: number) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border border-border rounded-lg px-6 shadow-sm"
              >
                <AccordionTrigger className="text-left font-semibold hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
