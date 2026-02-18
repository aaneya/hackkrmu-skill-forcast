import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { TrendingUp, BarChart3, AlertCircle, FileText, Lock, Zap } from "lucide-react";
import { getLoginUrl } from "@/const";
import Footer from "@/components/Footer";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleAdminClick = () => {
    if (user?.role === "admin") {
      setLocation("/admin");
    }
  };

  const handleDashboardClick = () => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Skill Forecast</h1>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
                {user?.role === "admin" && (
                  <Button variant="outline" onClick={handleAdminClick}>
                    Admin Panel
                  </Button>
                )}
                <Button variant="outline" onClick={handleDashboardClick}>
                  Dashboard
                </Button>
                <Button variant="ghost" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={() => window.location.href = getLoginUrl()}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-6">
          <h2 className="text-5xl font-bold text-gray-900">
            Forecast the Future of Tech Skills
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Harness advanced analytics and AI-powered insights to predict skill demand trends, make data-driven decisions, and stay ahead of the market.
          </p>
          <div className="flex gap-4 justify-center">
            {isAuthenticated ? (
              <>
                {user?.role === "admin" && (
                  <Button size="lg" onClick={handleAdminClick}>
                    Go to Admin Dashboard
                  </Button>
                )}
                <Button size="lg" variant="outline" onClick={handleDashboardClick}>
                  View Your Dashboard
                </Button>
              </>
            ) : (
              <Button size="lg" onClick={() => window.location.href = getLoginUrl()}>
                Get Started
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12">Powerful Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Trend Analysis</CardTitle>
                <CardDescription>Real-time skill demand tracking</CardDescription>
              </CardHeader>
              <CardContent>
                Monitor market trends in real-time and identify emerging skills before they become mainstream. Get early insights into skill demand patterns.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>Comprehensive data visualization</CardDescription>
              </CardHeader>
              <CardContent>
                Interactive dashboards with detailed charts and metrics. Analyze skill demand across categories, difficulty levels, and time periods.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <AlertCircle className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle>Smart Alerts</CardTitle>
                <CardDescription>Automated threshold notifications</CardDescription>
              </CardHeader>
              <CardContent>
                Receive instant alerts when skills reach critical demand thresholds. Stay informed about important market changes and opportunities.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Data Export</CardTitle>
                <CardDescription>Multiple export formats</CardDescription>
              </CardHeader>
              <CardContent>
                Export reports in CSV, PDF, or Excel formats. All files are securely stored in S3 with instant download links and automatic URL generation.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Lock className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>Role-Based Access</CardTitle>
                <CardDescription>Secure permission system</CardDescription>
              </CardHeader>
              <CardContent>
                Separate admin and user experiences. Admins manage skills and forecasts while users access analytics and insights. Full security controls.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 text-yellow-600 mb-2" />
                <CardTitle>AI Insights</CardTitle>
                <CardDescription>LLM-powered recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                Intelligent analysis powered by large language models. Get natural language summaries and actionable recommendations from your data.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { step: "1", title: "Track Skills", desc: "Monitor skill demand across the market" },
            { step: "2", title: "Create Forecasts", desc: "Generate predictions with confidence scores" },
            { step: "3", title: "Analyze Trends", desc: "Visualize patterns and market movements" },
            { step: "4", title: "Export Reports", desc: "Download insights in your preferred format" },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                {item.step}
              </div>
              <h4 className="font-semibold mb-2">{item.title}</h4>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h3 className="text-3xl font-bold">Ready to Forecast the Future?</h3>
          <p className="text-lg text-blue-100">
            Join thousands of professionals using Skill Forecast to make smarter decisions about technology trends.
          </p>
          {!isAuthenticated && (
            <Button size="lg" variant="secondary" onClick={() => window.location.href = getLoginUrl()}>
              Start Free Today
            </Button>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
