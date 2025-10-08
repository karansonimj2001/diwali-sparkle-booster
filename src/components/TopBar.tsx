import { MessageCircle, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const TopBar = () => {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    loadContent();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('topbar-content-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'page_content',
          filter: 'section=eq.topbar'
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
      .eq("section", "topbar")
      .single();
    
    if (data) setContent(data);
  };

  if (!content) return null;

  return (
    <div className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{content.title}</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">{content.subtitle}</span>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href={`https://wa.me/${content.whatsapp_number}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:opacity-80 transition-smooth"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
            <div className="flex items-center gap-2 text-xs opacity-90">
              <Shield className="h-3 w-3" />
              <span className="hidden md:inline">{content.content_json?.payment_methods}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
