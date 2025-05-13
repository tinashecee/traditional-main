import React, { useEffect, useState } from "react";
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
import {
  getActiveLeadersCounts,
  getProvinceWiseCounts,
} from "@/lib/apiService";

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
            className={`text-xs ${
              trend === "up"
                ? "text-emerald-500"
                : trend === "down"
                ? "text-red-500"
                : "text-muted-foreground"
            }`}>
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const MetricsOverview = () => {
  const [leadersCounts, setLeadersCounts] = useState({
    chiefs: 0,
    headmen: 0,
    villageheads: 0,
  });

  const [provinceWiseCounts, setProvinceWiseCounts] = useState({
    chiefs: {},
    headmen: {},
    villageheads: {},
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllCounts = async () => {
      try {
        const [activeCounts, provinceCounts] = await Promise.all([
          getActiveLeadersCounts(),
          getProvinceWiseCounts(),
        ]);
        setLeadersCounts(activeCounts);
        setProvinceWiseCounts(provinceCounts);
      } catch (error) {
        console.error("Failed to fetch counts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllCounts();
  }, []);

  const metrics = {
    overall: [
      {
        title: "Total Chiefs",
        value: isLoading
          ? "Loading..."
          : (leadersCounts?.chiefs ?? 0).toString(),
        description: "active chiefs",
        icon: <Crown className="h-4 w-4" />,
      },
      {
        title: "Total Headmen",
        value: isLoading
          ? "Loading..."
          : (leadersCounts?.headmen ?? 0).toString(),
        description: "active headmen",
        icon: <Users className="h-4 w-4" />,
      },
      {
        title: "Total Village Heads",
        value: isLoading
          ? "Loading..."
          : (leadersCounts?.villageheads ?? 0).toString(),
        description: "active village heads",
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
          <TabsTrigger value="chiefs">Chiefs by Province</TabsTrigger>
          <TabsTrigger value="headmen">Headmen by Province</TabsTrigger>
          <TabsTrigger value="villageheads">
            Village Heads by Province
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overall" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {metrics.overall.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="chiefs" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(provinceWiseCounts.chiefs).map(
              ([province, count]) => (
                <MetricCard
                  key={province}
                  title={province}
                  value={isLoading ? "Loading..." : count.toString()}
                  description="active chiefs"
                  icon={<Crown className="h-4 w-4" />}
                />
              )
            )}
          </div>
        </TabsContent>

        <TabsContent value="headmen" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(provinceWiseCounts.headmen).map(
              ([province, count]) => (
                <MetricCard
                  key={province}
                  title={province}
                  value={isLoading ? "Loading..." : count.toString()}
                  description="active headmen"
                  icon={<Users className="h-4 w-4" />}
                />
              )
            )}
          </div>
        </TabsContent>

        <TabsContent value="villageheads" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(provinceWiseCounts.villageheads).map(
              ([province, count]) => (
                <MetricCard
                  key={province}
                  title={province}
                  value={isLoading ? "Loading..." : count.toString()}
                  description="active village heads"
                  icon={<Home className="h-4 w-4" />}
                />
              )
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MetricsOverview;
