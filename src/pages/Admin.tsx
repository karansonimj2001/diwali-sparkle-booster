import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogOut } from "lucide-react";

interface PageContent {
  id: string;
  section: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  button_text: string | null;
  button_link: string | null;
}

interface OrderStats {
  totalOrders: number;
  todayOrders: number;
}

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [content, setContent] = useState<PageContent[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [orderStats, setOrderStats] = useState<OrderStats>({ totalOrders: 0, todayOrders: 0 });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .single();

    if (!roles) {
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "You don't have admin permissions.",
      });
      navigate("/");
      return;
    }

    setIsAdmin(true);
    loadContent();
    loadOrderStats();
  };

  const loadOrderStats = async () => {
    try {
      // Get total orders
      const { count: totalCount } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });

      // Get today's orders
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: todayCount } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .gte("created_at", today.toISOString());

      setOrderStats({
        totalOrders: totalCount || 0,
        todayOrders: todayCount || 0,
      });
    } catch (error: any) {
      console.error("Error loading order stats:", error);
    }
  };

  const loadContent = async () => {
    const { data, error } = await supabase
      .from("page_content")
      .select("*")
      .order("section");

    if (error) {
      toast({
        variant: "destructive",
        title: "Error loading content",
        description: error.message,
      });
    } else {
      setContent(data || []);
    }
    setLoading(false);
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
    }
    setSaving(null);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const updateField = (id: string, field: keyof PageContent, value: string) => {
    setContent(content.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
            <p className="text-muted-foreground">Manage your landing page content</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Order Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Orders</CardTitle>
              <CardDescription>All time orders received</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">{orderStats.totalOrders}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Today's Orders</CardTitle>
              <CardDescription>Orders received today</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-secondary">{orderStats.todayOrders}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6">
          {content.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="capitalize">{item.section} Section</CardTitle>
                <CardDescription>Update content for the {item.section} section</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={item.title || ""}
                    onChange={(e) => updateField(item.id, "title", e.target.value)}
                    placeholder="Enter title"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subtitle</label>
                  <Input
                    value={item.subtitle || ""}
                    onChange={(e) => updateField(item.id, "subtitle", e.target.value)}
                    placeholder="Enter subtitle"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={item.description || ""}
                    onChange={(e) => updateField(item.id, "description", e.target.value)}
                    placeholder="Enter description"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Button Text</label>
                    <Input
                      value={item.button_text || ""}
                      onChange={(e) => updateField(item.id, "button_text", e.target.value)}
                      placeholder="Enter button text"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Button Link</label>
                    <Input
                      value={item.button_link || ""}
                      onChange={(e) => updateField(item.id, "button_link", e.target.value)}
                      placeholder="Enter button link"
                    />
                  </div>
                </div>
                <Button 
                  onClick={() => handleUpdate(item)}
                  disabled={saving === item.id}
                  className="w-full"
                >
                  {saving === item.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
