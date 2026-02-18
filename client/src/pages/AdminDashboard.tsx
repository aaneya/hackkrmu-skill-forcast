import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { AlertCircle, TrendingUp, Users, Zap } from "lucide-react";
import SkillsManagement from "./admin/SkillsManagement";
import ForecastsManagement from "./admin/ForecastsManagement";
import AlertsManagement from "./admin/AlertsManagement";
import ReportsManagement from "./admin/ReportsManagement";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [location, setLocation] = useLocation();

  // Redirect non-admin users
  useEffect(() => {
    if (!loading && user?.role !== "admin") {
      setLocation("/");
    }
  }, [user, loading, setLocation]);

  const metricsQuery = trpc.metrics.getOverview.useQuery();
  const skillsQuery = trpc.skills.list.useQuery();
  const alertsQuery = trpc.alerts.getUnread.useQuery();

  if (loading || metricsQuery.isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg text-muted-foreground">Loading admin dashboard...</div>
        </div>
      </DashboardLayout>
    );
  }

  const metrics = metricsQuery.data;
  const skills = skillsQuery.data || [];
  const unreadAlerts = alertsQuery.data || [];

  // Prepare data for skill demand chart
  const skillDemandData = skills.slice(0, 8).map(skill => ({
    name: skill.name.substring(0, 10),
    demand: skill.currentDemand,
    category: skill.category,
  }));

  // Prepare data for difficulty distribution
  const difficultyDistribution = [
    { name: "Beginner", value: skills.filter(s => s.difficulty === "beginner").length },
    { name: "Intermediate", value: skills.filter(s => s.difficulty === "intermediate").length },
    { name: "Advanced", value: skills.filter(s => s.difficulty === "advanced").length },
    { name: "Expert", value: skills.filter(s => s.difficulty === "expert").length },
  ].filter(d => d.value > 0);

  // Prepare data for trend distribution
  const trendData = [
    { name: "Increasing", value: skills.filter(s => s.demandTrend === "increasing").length },
    { name: "Stable", value: skills.filter(s => s.demandTrend === "stable").length },
    { name: "Decreasing", value: skills.filter(s => s.demandTrend === "decreasing").length },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage skills, forecasts, and monitor system health</p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Skills</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.totalSkills || 0}</div>
              <p className="text-xs text-muted-foreground">Skills in database</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Forecasts</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.totalForecasts || 0}</div>
              <p className="text-xs text-muted-foreground">Forecast records</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread Alerts</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{metrics?.unreadAlerts || 0}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.totalAlerts || 0}</div>
              <p className="text-xs text-muted-foreground">System events</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Skill Demand Distribution</CardTitle>
              <CardDescription>Current demand levels across top skills</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={skillDemandData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="demand" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Difficulty Distribution</CardTitle>
              <CardDescription>Skills by difficulty level</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={difficultyDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {difficultyDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Demand Trend Distribution</CardTitle>
              <CardDescription>Skills by market trend</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={trendData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {trendData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>Latest system notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {unreadAlerts.slice(0, 5).map(alert => (
                  <div key={alert.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <div className={`h-2 w-2 rounded-full mt-2 ${
                      alert.severity === "critical" ? "bg-red-500" :
                      alert.severity === "high" ? "bg-orange-500" :
                      alert.severity === "medium" ? "bg-yellow-500" :
                      "bg-blue-500"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{alert.title}</p>
                      <p className="text-xs text-muted-foreground">{alert.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Management Tools</CardTitle>
            <CardDescription>Create and manage skills, forecasts, reports, and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="skills" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="forecasts">Forecasts</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="skills" className="mt-6">
                <SkillsManagement />
              </TabsContent>

              <TabsContent value="forecasts" className="mt-6">
                <ForecastsManagement />
              </TabsContent>

              <TabsContent value="alerts" className="mt-6">
                <AlertsManagement />
              </TabsContent>

              <TabsContent value="reports" className="mt-6">
                <ReportsManagement />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
