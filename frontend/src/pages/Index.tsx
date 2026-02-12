import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { GlassCard } from "@/components/GlassCard";
import { ShieldCheck, Sparkles, FileSearch } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center text-center py-12 px-4">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Career Booster
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-600 to-indigo-600">
            Master Your Next Job Application with ResumeIQ
          </h1>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
            Analyze your resume against real job roles using advanced ATS algorithms and get personalized AI feedback to land your dream job.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/login?mode=signup">
              <Button size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20">
                Start Building for Free
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-primary/20 glass-morphism hover:bg-white/10">
                Analyze Existing Resume
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-6xl w-full">
          <FeatureCard 
            icon={<ShieldCheck className="w-8 h-8 text-blue-500" />}
            title="ATS Scoring Engine"
            description="Our deterministic engine scores your resume based on keyword match, section presence, and formatting."
          />
          <FeatureCard 
            icon={<Sparkles className="w-8 h-8 text-indigo-500" />}
            title="AI Brain Integration"
            description="Get deep qualitative feedback from ChatGPT on your strengths, weaknesses, and specific role improvements."
          />
          <FeatureCard 
            icon={<FileSearch className="w-8 h-8 text-cyan-500" />}
            title="Real-time Optimizer"
            description="Build and optimize your resume in real-time with a smart chat interface and professional templates."
          />
        </div>

        {/* Social Proof / Stats */}
        <div className="mt-32 w-full max-w-lg">
          <GlassCard className="py-12 border-primary/10">
            <div className="flex justify-center items-center">
              <StatItem label="ATS Accuracy" value="99%" />
            </div>
          </GlassCard>
        </div>
      </div>
    </Layout>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="h-full"
  >
    <GlassCard className="h-full flex flex-col items-center text-center border-white/5 hover:border-primary/20 transition-colors">
      <div className="p-4 rounded-2xl bg-white/5 mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </GlassCard>
  </motion.div>
);

const StatItem = ({ label, value }: { label: string, value: string }) => (
  <div className="flex flex-col items-center">
    <span className="text-3xl font-extrabold text-primary mb-1">{value}</span>
    <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
  </div>
);

export default Index;
