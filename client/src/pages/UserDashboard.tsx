import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Zap } from "lucide-react";

export default function UserDashboard() {
  const { user, loading } = useAuth();
  const [location, setLocation] = useLocation();

  // Redirect non-authenticated users
  useEffect(() => {
    if (!loading && !user) {
      setLocation("/");
    }
  }, [user, loading, setLocation]);

  const metricsQuery = trpc.metrics.getOverview.useQuery();
  const skillsQuery = trpc.skills.list.useQuery();
  const forecastsQuery = trpc.forecasts.getRecent.useQuery({ days: 90 });

  if (loading || metricsQuery.isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg text-muted-foreground">Loading dashboard...</div>
        </div>
      </DashboardLayout>
    );
  }

  const metrics = metricsQuery.data;
  const skills = skillsQuery.data || [];
  const forecasts = forecastsQuery.data || [];

  // Prepare data for top skills by demand
  const topSkillsByDemand = skills
    .sort((a, b) => (b.currentDemand || 0) - (a.currentDemand || 0))
    .slice(0, 10)
    .map(skill => ({
      name: skill.name,
      demand: skill.currentDemand,
      trend: skill.demandTrend,
    }));

  // Prepare data for forecast trends
  const forecastTrends = forecasts
    .slice(0, 30)
    .sort((a, b) => new Date(a.forecastDate).getTime() - new Date(b.forecastDate).getTime())
    .map((f, idx) => ({
      date: new Date(f.forecastDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      demand: f.predictedDemand,
      confidence: parseFloat(f.confidence as any),
    }));

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome, {user?.name || "User"}! Explore skill trends and forecasts.</p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Skills</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.totalSkills || 0}</div>
              <p className="text-xs text-muted-foreground">Available in database</p>
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
              <CardTitle className="text-sm font-medium">Increasing Demand</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {skills.filter(s => s.demandTrend === "increasing").length}
              </div>
              <p className="text-xs text-muted-foreground">Skills with rising demand</p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics */}
        <Tabs defaultValue="topSkills" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="topSkills">Top Skills by Demand</TabsTrigger>
            <TabsTrigger value="forecasts">Forecast Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="topSkills" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Skills by Current Demand</CardTitle>
                <CardDescription>Skills with highest market demand</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={topSkillsByDemand}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="demand" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forecasts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Forecast Trends (90 Days)</CardTitle>
                <CardDescription>Predicted demand and confidence over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={forecastTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="demand" stroke="#3b82f6" name="Predicted Demand (%)" />
                    <Line type="monotone" dataKey="confidence" stroke="#10b981" name="Confidence (%)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Skills List */}
        <Card>
          <CardHeader>
            <CardTitle>All Skills</CardTitle>
            <CardDescription>Browse all available skills and their current demand</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {skills.map(skill => (
                <div key={skill.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{skill.name}</h3>
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {skill.difficulty}
                    </span>
                  </div>
                  {skill.description && (
                    <p className="text-sm text-muted-foreground mb-3">{skill.description}</p>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Demand</span>
                      <span className="text-sm">{skill.currentDemand}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${skill.currentDemand}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-muted-foreground">{skill.category || "Uncategorized"}</span>
                      <span className={`text-xs font-medium ${
                        skill.demandTrend === "increasing" ? "text-green-600" :
                        skill.demandTrend === "decreasing" ? "text-red-600" :
                        "text-gray-600"
                      }`}>
                        {skill.demandTrend}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
