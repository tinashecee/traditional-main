import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Bell,
  Settings,
  LogOut,
  Star,
  Home,
  Users,
  FileText,
  GitBranch,
  BarChart,
  Landmark,
  UserCog,
  Users2,
} from "lucide-react";
import MetricsOverview from "./Dashboard/MetricsOverview";
import AppointmentWorkflow from "./Appointments/AppointmentWorkflow";
import LineageTreeViewer from "./Lineage/LineageTreeViewer";
import Chieftainships from "./Dashboard/Chieftainships";
import Headmanships from "./Dashboard/Headmanships";
import Headmen from "./Dashboard/Headmen";
import Chiefs from "./Dashboard/Chiefs";
import VillageHeads from "./Dashboard/VillageHeads";
import {
  getRecentAppointments,
  getRecentDeathsRemovals,
} from "../lib/apiService";
import { MetricsLeader } from "../lib/types";

const HomePage = () => {
  const [activeTab, setActiveTab] = React.useState("dashboard");
  const { logout, userData } = useAuth();

  const [recentAppointments, setRecentAppointments] = useState<MetricsLeader[]>(
    []
  );
  const [deathsRemovals, setDeathsRemovals] = useState<MetricsLeader[]>([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [appointmentsData, deathsRemovalsData] = await Promise.all([
          getRecentAppointments(),
          getRecentDeathsRemovals(),
        ]);

        setRecentAppointments(appointmentsData);
        setDeathsRemovals(deathsRemovalsData);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };

    fetchMetrics();
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-primary p-2 rounded-md">
            <GitBranch className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Traditional</h2>
            <p className="text-xs text-muted-foreground">Leadership System</p>
          </div>
        </div>

        <nav className="space-y-1 flex-1">
          <Button
            variant={activeTab === "dashboard" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("dashboard")}>
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button
            variant={activeTab === "appointments" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("appointments")}>
            <FileText className="mr-2 h-4 w-4" />
            Appointments
          </Button>
          <Button
            variant={activeTab === "chieftainships" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("chieftainships")}>
            <Landmark className="mr-2 h-4 w-4" />
            Chieftainships
          </Button>
          <Button
            variant={activeTab === "headmanships" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("headmanships")}>
            <User className="mr-2 h-4 w-4" />
            Headmanships
          </Button>
          <Button
            variant={activeTab === "headmen" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("headmen")}>
            <UserCog className="mr-2 h-4 w-4" />
            Headmen
          </Button>
          <Button
            variant={activeTab === "chiefs" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("chiefs")}>
            <Landmark className="mr-2 h-4 w-4" />
            Chiefs
          </Button>
          <Button
            variant={activeTab === "villageHeads" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("villageHeads")}>
            <Users2 className="mr-2 h-4 w-4" />
            Village Heads
          </Button>
          <Button
            variant={activeTab === "lineage" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("lineage")}>
            <GitBranch className="mr-2 h-4 w-4" />
            Lineage Trees
          </Button>
          <Button
            variant={activeTab === "reports" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("reports")}>
            <BarChart className="mr-2 h-4 w-4" />
            Reports
          </Button>
          <Button
            variant={activeTab === "admin" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => (window.location.href = "/admin")}>
            <UserCog className="mr-2 h-4 w-4" />
            Admin Dashboard
          </Button>
        </nav>

        <div className="mt-auto pt-4 border-t">
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive"
            onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-card p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "appointments" && "Appointment Management"}
              {activeTab === "lineage" && "Lineage Trees"}
              {activeTab === "reports" && "Reports"}
            </h1>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                {userData?.role === "National Administrator" ? (
                  <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                ) : (
                  <Avatar>
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <p className="text-sm font-medium">
                    {userData?.username || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {userData?.role || "User Role"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>
                    Welcome to the Traditional Leadership Management System
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    This system helps manage Zimbabwe's traditional leadership
                    structures.
                  </p>
                </CardContent>
              </Card>

              <MetricsOverview />

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Appointments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentAppointments?.map((leader, index) => (
                        <div
                          key={`appointment-${leader?.type || "unknown"}-${
                            leader?.leader_id || index
                          }`}
                          className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">
                              {leader?.incumbent || "Unknown"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {leader?.type
                                ? `${leader.type
                                    .charAt(0)
                                    .toUpperCase()}${leader.type.slice(1)}`
                                : "Unknown"}{" "}
                              - {leader?.district || "N/A"},{" "}
                              {leader?.province || "N/A"}
                            </p>
                          </div>
                          <p className="text-sm text-gray-500">
                            {leader?.dateofappointment
                              ? new Date(
                                  leader.dateofappointment
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Deaths/Removals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {deathsRemovals.length > 0 ? (
                        deathsRemovals.map((leader, index) => (
                          <div
                            key={`removal-${leader?.type || "unknown"}-${
                              leader?.leader_id || index
                            }`}
                            className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">
                                {leader?.incumbent || "Unknown"}
                              </p>
                              <p className="text-sm text-gray-500">
                                {leader?.type
                                  ? `${leader.type
                                      .charAt(0)
                                      .toUpperCase()}${leader.type.slice(1)}`
                                  : "Unknown"}{" "}
                                - {leader?.district || "N/A"},{" "}
                                {leader?.province || "N/A"}
                              </p>
                            </div>
                            <p className="text-sm text-gray-500">
                              {leader?.dateofdeathorremoval
                                ? new Date(
                                    leader.dateofdeathorremoval
                                  ).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">
                          No recent deaths/removals
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "appointments" && <AppointmentWorkflow />}
          {activeTab === "lineage" && <LineageTreeViewer />}
          {activeTab === "chieftainships" && <Chieftainships />}
          {activeTab === "headmanships" && <Headmanships />}
          {activeTab === "headmen" && <Headmen />}
          {activeTab === "chiefs" && <Chiefs />}
          {activeTab === "villageHeads" && <VillageHeads />}
          {activeTab === "reports" && (
            <div className="grid place-items-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Reports Module</h2>
                <p className="text-muted-foreground">
                  This feature is coming soon.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HomePage;
