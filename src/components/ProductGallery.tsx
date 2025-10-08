import { useState, useEffect } from "react";
import defaultProductCloseup from "@/assets/product-closeup.jpg";
import defaultProductLifestyle from "@/assets/product-lifestyle.jpg";
import defaultPackagingBox from "@/assets/packaging-box.jpg";
import { ZoomIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ProductGallery = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    loadContent();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('product-gallery-content-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'page_content',
          filter: 'section=eq.product_gallery'
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
      .eq("section", "product_gallery")
      .maybeSingle();
    
    if (data) setContent(data);
  };

  const defaultImages = [
    { src: defaultProductCloseup, alt: "Tarnish-resistant gold earrings close-up view" },
    { src: defaultProductLifestyle, alt: "Woman wearing elegant gold earrings" },
    { src: defaultPackagingBox, alt: "Premium gift packaging with box and pouch" },
  ];

  const images = content?.content_json?.images?.length > 0 
    ? content.content_json.images 
    : defaultImages;

  const features = content?.content_json?.features || [];
  const packageContents = content?.content_json?.package_contents || [];

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Main Image */}
            <div className="relative group">
              <div className="relative rounded-2xl overflow-hidden shadow-card bg-muted">
                <img 
                  src={images[selectedImage].src || images[selectedImage].url}
                  alt={images[selectedImage].alt}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {images.map((image: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-primary shadow-warm' 
                        : 'border-transparent hover:border-primary/50'
                    }`}
                  >
                    <img 
                      src={image.src || image.url}
                      alt={image.alt}
                      className="w-full h-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {content?.title || "Tarnish-Resistant Gold Earrings"}
              </h2>
              
              <div className="space-y-4 mb-8">
                {features.map((feature: any, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {packageContents.length > 0 && (
                <div className="bg-muted/50 rounded-xl p-6 border border-border">
                  <h3 className="font-semibold mb-3 text-lg">What You Get:</h3>
                  <ul className="space-y-2 text-sm">
                    {packageContents.map((item: string, index: number) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="text-primary">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductGallery;
