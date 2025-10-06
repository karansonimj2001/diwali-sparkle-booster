import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ImageUploader } from "./ImageUploader";

interface PageContent {
  id: string;
  section: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  button_text: string | null;
  button_link: string | null;
  price: number | null;
  mrp: number | null;
  gift_wrap_price: number | null;
  whatsapp_number: string | null;
  order_by_date: string | null;
  stock_count: number | null;
  content_json: any;
  image_url: string | null;
}

interface ContentEditorProps {
  content: PageContent[];
  onUpdate: () => void;
}

export const ContentEditor = ({ content, onUpdate }: ContentEditorProps) => {
  const [saving, setSaving] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<PageContent[]>(content);
  const { toast } = useToast();

  const updateField = (id: string, field: keyof PageContent, value: any) => {
    setEditedContent(editedContent.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const updateJsonField = (id: string, path: string, value: any) => {
    setEditedContent(editedContent.map(item => {
      if (item.id === id) {
        const newJson = { ...item.content_json };
        const keys = path.split('.');
        let current = newJson;
        
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) current[keys[i]] = {};
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        return { ...item, content_json: newJson };
      }
      return item;
    }));
  };

  const handleUpdate = async (item: PageContent) => {
    setSaving(item.id);
    const { error } = await supabase
      .from("page_content")
      .update({
        title: item.title,
        subtitle: item.subtitle,
        description: item.description,
        button_text: item.button_text,
        button_link: item.button_link,
        price: item.price,
        mrp: item.mrp,
        gift_wrap_price: item.gift_wrap_price,
        whatsapp_number: item.whatsapp_number,
        order_by_date: item.order_by_date,
        stock_count: item.stock_count,
        content_json: item.content_json,
        image_url: item.image_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", item.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message,
      });
    } else {
      toast({
        title: "Content updated",
        description: "Changes saved successfully.",
      });
      onUpdate();
    }
    setSaving(null);
  };

  const renderEditor = (item: PageContent) => {
    const current = editedContent.find(c => c.id === item.id) || item;

    switch (item.section) {
      case 'topbar':
        return (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>Top Bar</CardTitle>
              <CardDescription>Edit the sticky top announcement bar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title (e.g., "Diwali Special")</Label>
                  <Input
                    value={current.title || ""}
                    onChange={(e) => updateField(item.id, "title", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle (e.g., "Free gift wrap")</Label>
                  <Input
                    value={current.subtitle || ""}
                    onChange={(e) => updateField(item.id, "subtitle", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>WhatsApp Number (with country code)</Label>
                  <Input
                    value={current.whatsapp_number || ""}
                    onChange={(e) => updateField(item.id, "whatsapp_number", e.target.value)}
                    placeholder="919876543210"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Payment Methods Text</Label>
                  <Input
                    value={current.content_json?.payment_methods || ""}
                    onChange={(e) => updateJsonField(item.id, "payment_methods", e.target.value)}
                    placeholder="UPI • COD • Cards"
                  />
                </div>
              </div>
              <Button onClick={() => handleUpdate(current)} disabled={saving === item.id} className="w-full">
                {saving === item.id ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        );

      case 'hero':
        return (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Main headline and call-to-action</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Main Headline</Label>
                <Textarea
                  value={current.title || ""}
                  onChange={(e) => updateField(item.id, "title", e.target.value)}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input
                    value={current.subtitle || ""}
                    onChange={(e) => updateField(item.id, "subtitle", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Badge Text</Label>
                  <Input
                    value={current.content_json?.badge_text || ""}
                    onChange={(e) => updateJsonField(item.id, "badge_text", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description (delivery info)</Label>
                <Input
                  value={current.description || ""}
                  onChange={(e) => updateField(item.id, "description", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary Button Text</Label>
                  <Input
                    value={current.button_text || ""}
                    onChange={(e) => updateField(item.id, "button_text", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Secondary Button Text</Label>
                  <Input
                    value={current.content_json?.secondary_button || ""}
                    onChange={(e) => updateJsonField(item.id, "secondary_button", e.target.value)}
                  />
                </div>
              </div>
              <ImageUploader
                label="Hero Image"
                currentImageUrl={current.image_url || ""}
                onImageUploaded={(url) => updateField(item.id, "image_url", url)}
              />
              <Button onClick={() => handleUpdate(current)} disabled={saving === item.id} className="w-full">
                {saving === item.id ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        );

      case 'pricing':
        return (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>Pricing Section</CardTitle>
              <CardDescription>Product pricing and purchase options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Price (₹)</Label>
                  <Input
                    type="number"
                    value={current.price || ""}
                    onChange={(e) => updateField(item.id, "price", parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>MRP (₹)</Label>
                  <Input
                    type="number"
                    value={current.mrp || ""}
                    onChange={(e) => updateField(item.id, "mrp", parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gift Wrap Price (₹)</Label>
                  <Input
                    type="number"
                    value={current.gift_wrap_price || ""}
                    onChange={(e) => updateField(item.id, "gift_wrap_price", parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Section Title</Label>
                  <Input
                    value={current.title || ""}
                    onChange={(e) => updateField(item.id, "title", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Stock Count</Label>
                  <Input
                    type="number"
                    value={current.stock_count || ""}
                    onChange={(e) => updateField(item.id, "stock_count", parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Urgency Message</Label>
                  <Input
                    value={current.subtitle || ""}
                    onChange={(e) => updateField(item.id, "subtitle", e.target.value)}
                    placeholder="Only X kits left"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Savings Text</Label>
                  <Input
                    value={current.description || ""}
                    onChange={(e) => updateField(item.id, "description", e.target.value)}
                    placeholder="Save ₹X (Y% off)"
                  />
                </div>
              </div>
              <Button onClick={() => handleUpdate(current)} disabled={saving === item.id} className="w-full">
                {saving === item.id ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        );

      case 'why_choose_us':
      case 'faq':
      case 'product_gallery':
      case 'packaging':
        return (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="capitalize">{item.section.replace(/_/g, ' ')}</CardTitle>
              <CardDescription>Edit {item.section} content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={current.title || ""}
                  onChange={(e) => updateField(item.id, "title", e.target.value)}
                />
              </div>
              {current.subtitle && (
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input
                    value={current.subtitle || ""}
                    onChange={(e) => updateField(item.id, "subtitle", e.target.value)}
                  />
                </div>
              )}
              {(item.section === 'packaging') && (
                <ImageUploader
                  label="Packaging Image"
                  currentImageUrl={current.content_json?.image_url || current.image_url || ""}
                  onImageUploaded={(url) => updateJsonField(item.id, "image_url", url)}
                />
              )}
              {(item.section === 'product_gallery') && (
                <div className="space-y-2">
                  <Label>Product Images (Advanced - JSON Array)</Label>
                  <p className="text-xs text-muted-foreground">
                    Upload images and add to JSON as: {`[{"url": "image_url", "alt": "description"}]`}
                  </p>
                  <ImageUploader
                    label="Upload New Product Image"
                    onImageUploaded={(url) => {
                      toast({
                        title: "Image uploaded",
                        description: `URL: ${url} - Add this to the images array in the JSON below`,
                      });
                    }}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label>Content JSON {item.section === 'product_gallery' && '(Add uploaded image URLs here)'}</Label>
                <Textarea
                  value={JSON.stringify(current.content_json, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      updateField(item.id, "content_json", parsed);
                    } catch (error) {
                      // Invalid JSON, don't update
                    }
                  }}
                  rows={12}
                  className="font-mono text-xs"
                />
              </div>
              <Button onClick={() => handleUpdate(current)} disabled={saving === item.id} className="w-full">
                {saving === item.id ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="capitalize">{item.section}</CardTitle>
              <CardDescription>Edit {item.section} content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Content JSON</Label>
                <Textarea
                  value={JSON.stringify(current.content_json, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      updateField(item.id, "content_json", parsed);
                    } catch (error) {
                      // Invalid JSON
                    }
                  }}
                  rows={8}
                  className="font-mono text-xs"
                />
              </div>
              <Button onClick={() => handleUpdate(current)} disabled={saving === item.id} className="w-full">
                {saving === item.id ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Page Content</h2>
        <p className="text-muted-foreground">Manage all landing page content from here</p>
      </div>
      
      <div className="grid gap-6">
        {editedContent.map((item) => renderEditor(item))}
      </div>
    </div>
  );
};
