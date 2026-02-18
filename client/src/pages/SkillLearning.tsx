import React from 'react';
import { Zap, BookOpen, Globe, Lightbulb, Target, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocation } from 'wouter';
import Footer from '@/components/Footer';

interface SkillInfo {
  id: string;
  title: string;
  whatIsIt: string;
  howToLearn: string;
  globalImpact: string;
  color: string;
}

const skillsData: Record<string, SkillInfo> = {
  'learn-ai': {
    id: 'learn-ai',
    title: 'Artificial Intelligence & Machine Learning',
    whatIsIt: 'AI is the simulation of human intelligence by machines, while ML is a subset focused on algorithms that improve through experience. It encompasses generative AI, neural networks, and natural language processing.',
    howToLearn: 'Start with Python basics, then move to libraries like NumPy and Pandas. Explore platforms like Coursera (DeepLearning.ai) or fast.ai. Practice by building small projects like chatbots or image classifiers.',
    globalImpact: 'AI is revolutionizing every industry from healthcare diagnostics to climate modeling. Globally, it is expected to contribute $15.7 trillion to the global economy by 2030.',
    color: 'blue'
  },
  'learn-cloud': {
    id: 'learn-cloud',
    title: 'Cloud Computing & Infrastructure',
    whatIsIt: 'Cloud computing is the on-demand delivery of IT resources over the internet. It includes Infrastructure as a Service (IaaS), Platform as a Service (PaaS), and Software as a Service (SaaS).',
    howToLearn: 'Choose a major provider (AWS, Azure, or Google Cloud). Start with foundational certifications like AWS Cloud Practitioner. Learn about virtualization, containers (Docker/Kubernetes), and serverless architecture.',
    globalImpact: 'Cloud infrastructure is the backbone of the digital economy, enabling remote work, global scalability, and cost-effective innovation for startups and enterprises alike.',
    color: 'cyan'
  },
  'learn-cyber': {
    id: 'learn-cyber',
    title: 'Cybersecurity & Ethical Hacking',
    whatIsIt: 'Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. Ethical hacking involves authorized attempts to gain unauthorized access to identify vulnerabilities.',
    howToLearn: 'Understand networking fundamentals (TCP/IP). Learn about common vulnerabilities (OWASP Top 10). Use platforms like TryHackMe or HackTheBox. Pursue certifications like CompTIA Security+ or CEH.',
    globalImpact: 'As digital transformation accelerates, cybersecurity is a matter of national security and corporate survival. There is a global talent gap of over 3 million cybersecurity professionals.',
    color: 'red'
  },
  'learn-green': {
    id: 'learn-green',
    title: 'Green Tech & Sustainability',
    whatIsIt: 'Green technology refers to technology that is considered environmentally friendly based on its production process or supply chain. It includes renewable energy, carbon capture, and sustainable agriculture.',
    howToLearn: 'Study environmental science basics combined with data analysis. Learn about ESG (Environmental, Social, and Governance) reporting. Explore specialized courses on renewable energy systems or circular economy principles.',
    globalImpact: 'The transition to a net-zero economy is the greatest challenge of our time. Green skills are becoming mandatory across all sectors to meet global climate goals.',
    color: 'green'
  },
  'intro-skills-world': {
    id: 'intro-skills-world',
    title: 'Introducing Skills to the Global Workforce',
    whatIsIt: 'This is the strategic process of identifying emerging skill gaps and implementing large-scale upskilling initiatives across diverse populations and geographies.',
    howToLearn: 'Focus on change management, educational psychology, and data-driven workforce planning. Learn how to use platforms like FutureSkills Predict to identify regional demand and tailor learning programs.',
    globalImpact: 'Closing the global skills gap could add $11.5 trillion to global GDP by 2028. It is essential for ensuring equitable growth and social stability in the age of automation.',
    color: 'orange'
  }
};

const SkillLearningPage: React.FC<{ params: { skillId: string } }> = ({ params }) => {
  const [, setLocation] = useLocation();
  const skill = skillsData[params.skillId] || skillsData['learn-ai'];

  const getColorClass = (color: string) => {
    const classes: Record<string, string> = {
      blue: 'text-blue-600 bg-blue-50 border-blue-100',
      cyan: 'text-cyan-600 bg-cyan-50 border-cyan-100',
      red: 'text-red-600 bg-red-50 border-red-100',
      green: 'text-green-600 bg-green-50 border-green-100',
      orange: 'text-orange-600 bg-orange-50 border-orange-100',
    };
    return classes[color] || classes.blue;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setLocation('/')}>
            <Zap className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">FutureSkills Predict</h1>
          </div>
          <Button variant="ghost" onClick={() => setLocation('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center">
          <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold border mb-6 ${getColorClass(skill.color)}`}>
            Skills Learning Hub
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">{skill.title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master the most in-demand skills of 2026 and beyond.
          </p>
        </div>

        <div className="grid gap-8">
          <Card className="overflow-hidden border-none shadow-lg">
            <div className={`h-2 w-full bg-${skill.color}-500`} style={{ backgroundColor: skill.color === 'orange' ? '#F97316' : undefined }}></div>
            <CardHeader className="bg-white pt-8">
              <div className="flex items-center gap-3 mb-2">
                <Lightbulb className="h-6 w-6 text-orange-500" />
                <CardTitle className="text-2xl">What is this skill?</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="bg-white pb-8">
              <p className="text-gray-700 text-lg leading-relaxed">
                {skill.whatIsIt}
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-md">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-blue-600" />
                  <CardTitle>How to learn it</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {skill.howToLearn}
                </p>
                <div className="mt-6">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Explore Learning Path
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Globe className="h-6 w-6 text-green-600" />
                  <CardTitle>Global Impact</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {skill.globalImpact}
                </p>
                <div className="mt-6">
                  <Button variant="outline" className="w-full">
                    View Market Trends
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-xl">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-grow space-y-4">
                  <h3 className="text-2xl font-bold">Ready to start your journey?</h3>
                  <p className="text-slate-300">
                    Our AI-powered platform predicts which sub-skills will be most valuable in your specific region and industry.
                  </p>
                  <div className="flex gap-4 pt-2">
                    <Button className="bg-[#F97316] hover:bg-[#ea580c] text-white">Get Personalized Roadmap</Button>
                    <Button variant="outline" className="text-white border-slate-600 hover:bg-slate-700">Talk to Mentor</Button>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="w-32 h-32 bg-blue-600/20 rounded-full flex items-center justify-center border border-blue-500/30 animate-pulse">
                    <BookOpen className="h-12 w-12 text-blue-400" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SkillLearningPage;
