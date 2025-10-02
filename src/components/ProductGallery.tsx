import { useState } from "react";
import productCloseup from "@/assets/product-closeup.jpg";
import productLifestyle from "@/assets/product-lifestyle.jpg";
import packagingBox from "@/assets/packaging-box.jpg";
import { ZoomIn } from "lucide-react";

const ProductGallery = () => {
  const [selectedImage, setSelectedImage] = useState(0);

  const images = [
    { src: productCloseup, alt: "Tarnish-resistant gold earrings close-up view" },
    { src: productLifestyle, alt: "Woman wearing elegant gold earrings" },
    { src: packagingBox, alt: "Premium gift packaging with box and pouch" },
  ];

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Main Image */}
            <div className="relative group">
              <div className="relative rounded-2xl overflow-hidden shadow-card bg-muted">
                <img 
                  src={images[selectedImage].src}
                  alt={images[selectedImage].alt}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {images.map((image, index) => (
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
                      src={image.src}
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
                Tarnish-Resistant Gold Earrings
              </h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <h3 className="font-semibold mb-1">Long-lasting Shine</h3>
                    <p className="text-muted-foreground">Advanced tarnish-resistant coating keeps them looking new for years</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <h3 className="font-semibold mb-1">Gentle on Skin</h3>
                    <p className="text-muted-foreground">Hypoallergenic posts safe for sensitive ears</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <h3 className="font-semibold mb-1">Gift-Ready Packaging</h3>
                    <p className="text-muted-foreground">Comes in premium box with satin pouch — no extra wrapping needed</p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-xl p-6 border border-border">
                <h3 className="font-semibold mb-3 text-lg">What You Get:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>Pair of tarnish-resistant earrings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>Premium gift box</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>Satin storage pouch</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>Handwritten greeting card</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>Care instructions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductGallery;
