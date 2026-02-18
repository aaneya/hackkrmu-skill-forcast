import React from 'react';
import { Zap, Facebook, Twitter, Linkedin, Github, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0f172a] text-slate-300 pt-16 pb-8 font-['Inter',sans-serif] border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section - Stacks above columns on mobile */}
        <div className="bg-gradient-to-r from-[#1E3A8A] to-[#1e40af] rounded-2xl p-8 mb-16 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl border border-blue-800/50">
          <div className="max-w-md text-center lg:text-left">
            <h3 className="text-2xl font-bold text-white mb-2">Predict the future of your career</h3>
            <p className="text-blue-100">Get weekly skill demand forecasts and learning paths delivered to your inbox.</p>
          </div>
          <form className="flex flex-col sm:flex-row w-full lg:w-auto gap-3" onSubmit={(e) => e.preventDefault()}>
            <div className="relative flex-grow min-w-[280px]">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:ring-[#F97316] h-12 w-full"
              />
            </div>
            <Button className="bg-[#F97316] hover:bg-[#ea580c] text-white font-semibold h-12 px-8 transition-all duration-300 shadow-lg shadow-orange-900/20">
              Subscribe <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Main Footer Grid: 1col mobile → 2col tablet → 5col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Column 1: Product */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#F97316] rounded-full"></span>
              Product
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Dashboard', href: '/dashboard' },
                { name: 'Skills Explorer', href: '/skills' },
                { name: 'Recommendations', href: '/recommendations' },
                { name: 'Alerts', href: '/alerts' },
                { name: 'Visualizations', href: '/visuals' },
                { name: 'Learning Paths', href: '/paths' },
                { name: 'Certifications', href: '/certs' }
              ].map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-[#F97316] transition-colors duration-200 block py-1 min-h-[48px] flex items-center">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Pricing & Company */}
          <div className="space-y-12">
            <div>
              <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#F97316] rounded-full"></span>
                Pricing
              </h4>
              <ul className="space-y-3">
                {[
                  { name: 'Plans', href: '/pricing' },
                  { name: 'Free Trial', href: '/trial' },
                  { name: 'Enterprise', href: '/enterprise' },
                  { name: 'Non-profits', href: '/non-profits' },
                  { name: 'Education', href: '/edu' },
                  { name: 'Student Discount', href: '/students' }
                ].map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="hover:text-[#F97316] transition-colors duration-200 block py-1 min-h-[48px] flex items-center">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#F97316] rounded-full"></span>
                Company
              </h4>
              <ul className="space-y-3">
                {[
                  { name: 'About', href: '/about' },
                  { name: 'Careers', href: '/careers' },
                  { name: 'Team', href: '/team' },
                  { name: 'Press', href: '/press' },
                  { name: 'Partners', href: '/partners' },
                  { name: 'Investors', href: '/investors' },
                  { name: 'Jobs Report', href: '/jobs-report' }
                ].map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="hover:text-[#F97316] transition-colors duration-200 block py-1 min-h-[48px] flex items-center">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#F97316] rounded-full"></span>
              Resources
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Blog', href: '/blog' },
                { name: 'Research', href: '/research' },
                { name: 'Reports', href: '/reports' },
                { name: 'Webinars', href: '/webinars' },
                { name: 'Podcasts', href: '/podcasts' },
                { name: 'Case Studies', href: '/case-studies' }
              ].map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-[#F97316] transition-colors duration-200 block py-1 min-h-[48px] flex items-center">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Support & Skills Hub */}
          <div className="space-y-12">
            <div>
              <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#F97316] rounded-full"></span>
                Support
              </h4>
              <ul className="space-y-3">
                {[
                  { name: 'Documentation', href: '/docs' },
                  { name: 'API Reference', href: '/api' },
                  { name: 'Support Center', href: '/support' },
                  { name: 'System Status', href: '/status' },
                  { name: 'Community', href: '/community' }
                ].map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="hover:text-[#F97316] transition-colors duration-200 block py-1 min-h-[48px] flex items-center">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#F97316] rounded-full"></span>
                Skills Learning
              </h4>
              <ul className="space-y-3">
                {[
                  { name: 'Learn AI', href: '/skills/learn-ai' },
                  { name: 'Learn Cloud', href: '/skills/learn-cloud' },
                  { name: 'Learn Cyber', href: '/skills/learn-cyber' },
                  { name: 'Learn Green', href: '/skills/learn-green' },
                  { name: 'Introduce Skills', href: '/skills/intro-skills-world' }
                ].map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="hover:text-[#F97316] font-medium transition-colors duration-200 block py-1 min-h-[48px] flex items-center">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 5: Branding & Contact */}
          <div className="lg:col-span-1 space-y-8">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="h-8 w-8 text-[#F97316]" />
              <span className="text-2xl font-bold text-white tracking-tight">FutureSkills</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              The world's leading platform for predictive skill analytics. Empowering professionals and organizations to stay ahead of the technological curve since 2026.
            </p>
            <div className="space-y-4">
              <h5 className="text-white font-semibold">Connect with us</h5>
              <div className="flex gap-4">
                {[
                  { icon: <Twitter className="h-5 w-5" />, href: '#' },
                  { icon: <Linkedin className="h-5 w-5" />, href: '#' },
                  { icon: <Github className="h-5 w-5" />, href: '#' },
                  { icon: <Facebook className="h-5 w-5" />, href: '#' }
                ].map((social, idx) => (
                  <a 
                    key={idx} 
                    href={social.href} 
                    className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#F97316] hover:text-white transition-all duration-300 min-h-[48px] min-w-[48px]"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-slate-800">
              <p className="text-sm text-slate-400 mb-2">Contact Support:</p>
              <a href="mailto:support@futureskills.predict" className="text-white hover:text-[#F97316] font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" /> support@futureskills.predict
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-slate-500 order-2 md:order-1">
            © 2026 FutureSkills Predict. All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 order-1 md:order-2">
            {[
              { name: 'Privacy', href: '/privacy' },
              { name: 'Terms', href: '/terms' },
              { name: 'Cookies', href: '/cookies' },
              { name: 'Security', href: '/security' },
              { name: 'GDPR', href: '/gdpr' },
              { name: 'Accessibility', href: '/accessibility' }
            ].map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-xs font-medium text-slate-500 hover:text-white transition-colors duration-200 min-h-[48px] flex items-center"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
