import React from 'react';
import { Layout, Smartphone, Palette, Link as LinkIcon, Shield, CheckCircle2, Zap, BarChart3, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

const ProjectShowcase: React.FC = () => {
  const [, setLocation] = useLocation();

  const features = [
    {
      title: "5-Column Desktop Layout",
      desc: "Optimized for large screens with clear information hierarchy and logical grouping.",
      icon: <Layout className="h-6 w-6 text-blue-500" />
    },
    {
      title: "Mobile-First Responsive",
      desc: "Smart stacking logic (1col mobile → 2col tablet) with 48px touch targets to fix congestion.",
      icon: <Smartphone className="h-6 w-6 text-orange-500" />
    },
    {
      title: "Tech-Themed Design",
      desc: "Blue/Orange gradient theme matching the prediction platform with smooth hover animations.",
      icon: <Palette className="h-6 w-6 text-indigo-500" />
    },
    {
      title: "30+ Navigation Links",
      desc: "Comprehensive coverage of Product, Pricing, Company, Resources, and Support sections.",
      icon: <LinkIcon className="h-6 w-6 text-green-500" />
    },
    {
      title: "Skills Learning Hub",
      desc: "Dedicated landing pages for AI, Cloud, Cyber, and Green skills with global impact data.",
      icon: <Globe className="h-6 w-6 text-cyan-500" />
    },
    {
      title: "Legal & Security Bar",
      desc: "GDPR-ready bottom bar with Accessibility, Security, and Cookie policy links.",
      icon: <Shield className="h-6 w-6 text-red-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter',sans-serif]">
      {/* Hero Section */}
      <div className="bg-[#0f172a] text-white py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
            <Zap className="h-4 w-4" /> Feature Update: Production-Ready Footer
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            FutureSkills Predict <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">Footer Evolution</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            A comprehensive, high-performance footer system designed for modern tech platforms. Scalable, accessible, and deeply integrated with global skills learning.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-[#F97316] hover:bg-[#ea580c]" onClick={() => setLocation('/')}>
              View Live Demo
            </Button>
            <Button size="lg" variant="outline" className="text-white border-slate-700 hover:bg-slate-800">
              View Source Code
            </Button>
          </div>
        </div>
      </div>

      {/* Interactive Feature Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Core Enhancements</h2>
          <p className="text-slate-600">Explore how we've transformed the site's foundation for a better user experience.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <Card key={i} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="mb-4 p-3 rounded-xl bg-slate-50 w-fit">
                  {f.icon}
                </div>
                <CardTitle className="text-xl font-bold">{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Visual Data Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-slate-900">Why this matters</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-1 bg-green-100 p-1 rounded-full h-fit">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Improved Retention</h4>
                    <p className="text-slate-600">Clear navigation reduces bounce rates and helps users discover deep resources like documentation and case studies.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 bg-green-100 p-1 rounded-full h-fit">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Global Accessibility</h4>
                    <p className="text-slate-600">Adhering to WCAG standards with 48px tap targets and high-contrast text ensures every user can navigate your site.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 bg-green-100 p-1 rounded-full h-fit">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Trust & Compliance</h4>
                    <p className="text-slate-600">A comprehensive legal bar builds immediate trust with enterprise clients and ensures GDPR/Accessibility compliance.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" /> User Interaction Metrics
                </h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">2026 Forecast</span>
              </div>
              <div className="space-y-6">
                {[
                  { label: "Mobile Navigation Ease", value: 98, color: "bg-blue-500" },
                  { label: "Skill Hub Discoverability", value: 85, color: "bg-orange-500" },
                  { label: "Legal Compliance Score", value: 100, color: "bg-green-500" },
                  { label: "Newsletter Conversion", value: 72, color: "bg-indigo-500" }
                ].map((stat, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-slate-600">{stat.label}</span>
                      <span className="text-slate-900">{stat.value}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full ${stat.color} transition-all duration-1000`} style={{ width: `${stat.value}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold mb-6">Ready to see the results?</h2>
        <Button size="lg" className="bg-[#1E3A8A] hover:bg-[#1e40af]" onClick={() => setLocation('/')}>
          Return to Platform
        </Button>
      </div>

      <footer className="py-8 border-t border-slate-200 text-center text-slate-500 text-sm">
        Built with FutureSkills Predict Design System v2.0
      </footer>
    </div>
  );
};

export default ProjectShowcase;
