import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import Dashboard from "@/components/admin/Dashboard";
import OrdersTable from "@/components/admin/OrdersTable";

interface PageContent {
  id: string;
  section: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  button_text: string | null;
  button_link: string | null;
}

interface Order {
  id: string;
  created_at: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  amount: number;
  status: string;
  gift_wrap: boolean;
  gift_note: string | null;
  hide_price: boolean;
  razorpay_payment_id: string | null;
}

interface Stats {
  totalOrders: number;
  todayOrders: number;
  totalRevenue: number;
  paidOrders: number;
}

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [content, setContent] = useState<PageContent[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    todayOrders: 0,
    totalRevenue: 0,
    paidOrders: 0,
  });
  const [saving, setSaving] = useState<string | null>(null);
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
    loadAllData();
  };

  const loadAllData = async () => {
    await Promise.all([loadContent(), loadOrders(), loadStats()]);
    setLoading(false);
  };

  const loadStats = async () => {
    try {
      const { count: totalCount } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: todayCount } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .gte("created_at", today.toISOString());

      const { data: paidOrders } = await supabase
        .from("orders")
        .select("amount")
        .eq("status", "paid");

      const totalRevenue = paidOrders?.reduce((sum, order) => sum + order.amount, 0) || 0;
      const paidCount = paidOrders?.length || 0;

      setStats({
        totalOrders: totalCount || 0,
        todayOrders: todayCount || 0,
        totalRevenue,
        paidOrders: paidCount,
      });
    } catch (error: any) {
      console.error("Error loading stats:", error);
    }
  };

  const loadOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error loading orders",
        description: error.message,
      });
    } else {
      setOrders(data || []);
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar currentTab={currentTab} onTabChange={setCurrentTab} />
        
        <main className="flex-1 bg-gradient-to-br from-background to-muted/20">
          <div className="container mx-auto px-4 py-8">
            {currentTab === "dashboard" && <Dashboard stats={stats} />}
            
            {currentTab === "orders" && (
              <OrdersTable 
                orders={orders} 
                onStatusUpdate={() => {
                  loadOrders();
                  loadStats();
                }}
              />
            )}
            
            {currentTab === "content" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Page Content</h2>
                  <p className="text-muted-foreground">Manage your landing page content</p>
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
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
