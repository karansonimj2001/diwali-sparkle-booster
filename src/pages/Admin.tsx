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
import { ContentEditor } from "@/components/admin/ContentEditor";

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
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_pincode: string | null;
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
              <ContentEditor content={content} onUpdate={loadContent} />
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
