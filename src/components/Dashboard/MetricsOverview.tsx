import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Crown,
  Home,
  AlertTriangle,
} from "lucide-react";
import { BarChart } from "@/components/ui/bar-chart";

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon: React.ReactNode;
}

const MetricCard = ({
  title,
  value,
  description,
  trend = "neutral",
  trendValue = "0%",
  icon,
}: MetricCardProps) => {
  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center pt-1">
          {trend === "up" && (
            <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
          )}
          {trend === "down" && (
            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
          )}
          <p
            className={`text-xs ${trend === "up" ? "text-emerald-500" : trend === "down" ? "text-red-500" : "text-muted-foreground"}`}
          >
            {trendValue} {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const MetricsOverview = () => {
  // Mock data - in a real application, this would come from an API or state management
  const metrics = {
    overall: [
      {
        title: "Total Chiefs",
        value: "271",
        description: "from last month",
        trend: "up" as const,
        trendValue: "2.5%",
        icon: <Crown className="h-4 w-4" />,
      },
      {
        title: "Total Headmen",
        value: "1,842",
        description: "from last month",
        trend: "up" as const,
        trendValue: "1.2%",
        icon: <Users className="h-4 w-4" />,
      },
      {
        title: "Total Village Heads",
        value: "25,367",
        description: "from last month",
        trend: "up" as const,
        trendValue: "0.8%",
        icon: <Home className="h-4 w-4" />,
      },
      {
        title: "Current Vacancies",
        value: "43",
        description: "positions to fill",
        trend: "down" as const,
        trendValue: "12%",
        icon: <AlertTriangle className="h-4 w-4" />,
      },
    ],
    appointments: [
      {
        title: "Pending Appointments",
        value: "18",
        description: "awaiting approval",
        trend: "neutral" as const,
        icon: <Crown className="h-4 w-4" />,
      },
      {
        title: "Approved This Month",
        value: "7",
        description: "new appointments",
        trend: "up" as const,
        trendValue: "40%",
        icon: <Users className="h-4 w-4" />,
      },
      {
        title: "Rejected Applications",
        value: "3",
        description: "this quarter",
        trend: "down" as const,
        trendValue: "25%",
        icon: <AlertTriangle className="h-4 w-4" />,
      },
      {
        title: "Average Approval Time",
        value: "42 days",
        description: "processing time",
        trend: "down" as const,
        trendValue: "5%",
        icon: <Home className="h-4 w-4" />,
      },
    ],
    regional: [
      {
        title: "Mashonaland",
        value: "87",
        description: "traditional leaders",
        trend: "neutral" as const,
        icon: <Crown className="h-4 w-4" />,
      },
      {
        title: "Matabeleland",
        value: "64",
        description: "traditional leaders",
        trend: "up" as const,
        trendValue: "3%",
        icon: <Users className="h-4 w-4" />,
      },
      {
        title: "Manicaland",
        value: "52",
        description: "traditional leaders",
        trend: "neutral" as const,
        icon: <Home className="h-4 w-4" />,
      },
      {
        title: "Midlands",
        value: "68",
        description: "traditional leaders",
        trend: "up" as const,
        trendValue: "1.5%",
        icon: <AlertTriangle className="h-4 w-4" />,
      },
    ],
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Metrics Overview</h2>
      </div>

      <Tabs defaultValue="overall" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overall">Overall Statistics</TabsTrigger>
          <TabsTrigger value="appointments">Appointment Status</TabsTrigger>
          <TabsTrigger value="regional">Regional Breakdown</TabsTrigger>
          <TabsTrigger value="provincial">Provincial Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="overall" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {metrics.overall.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {metrics.appointments.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="regional" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {metrics.regional.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="provincial" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <BarChart
                title="Chiefs by Province"
                labels={["Mashonaland", "Matabeleland", "Manicaland", "Midlands"]}
                data={[87, 64, 52, 68]}
                backgroundColor="rgba(59, 130, 246, 0.5)"
              />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <BarChart
                title="Headmen by Province"
                labels={["Mashonaland", "Matabeleland", "Manicaland", "Midlands"]}
                data={[342, 198, 187, 256]}
                backgroundColor="rgba(16, 185, 129, 0.5)"
              />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <BarChart
                title="Village Heads by Province"
                labels={["Mashonaland", "Matabeleland", "Manicaland", "Midlands"]}
                data={[1250, 980, 876, 1024]}
                backgroundColor="rgba(245, 158, 11, 0.5)"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MetricsOverview;
