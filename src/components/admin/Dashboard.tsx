import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, DollarSign, Package, TrendingUp } from "lucide-react";

interface DashboardProps {
  stats: {
    totalOrders: number;
    todayOrders: number;
    totalRevenue: number;
    paidOrders: number;
  };
}

const Dashboard = ({ stats }: DashboardProps) => {
  const statsCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      description: "All time orders",
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      description: "Total earnings",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Paid Orders",
      value: stats.paidOrders,
      description: "Successfully paid",
      icon: Package,
      color: "text-purple-600",
    },
    {
      title: "Today's Orders",
      value: stats.todayOrders,
      description: "Orders received today",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your store performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
          <CardDescription>Performance metrics at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Conversion Rate</span>
              <span className="font-semibold">
                {stats.totalOrders > 0 
                  ? ((stats.paidOrders / stats.totalOrders) * 100).toFixed(1) 
                  : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Average Order Value</span>
              <span className="font-semibold">
                ₹{stats.paidOrders > 0 
                  ? Math.round(stats.totalRevenue / stats.paidOrders) 
                  : 0}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
