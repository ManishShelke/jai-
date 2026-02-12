import { useState } from "react";
import { Layout } from "@/components/Layout";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileCheck, AlertCircle, CheckCircle2, Search, Zap, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";

interface SectionAnalysis {
  name: string;
  score: number;
  analysis: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

interface AnalysisResponse {
  success: boolean;
  atsScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  aiAnalysis: {
    sections: SectionAnalysis[];
    overallScore: number;
    topImprovements: string[];
    summary: string;
  };
}

const Dashboard = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [jobRole, setJobRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResponse | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !jobRole || !industry) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please upload a file and select both job role and industry.",
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobRole", jobRole);
    formData.append("industry", industry);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Analysis failed");
      }

      const data = await response.json();
      setResults(data);
      toast({
        title: "Analysis complete",
        description: "Your resume has been analyzed successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="py-8 space-y-12">
        <header>
          <h1 className="text-4xl font-bold mb-2">Resume Dashboard</h1>
          <p className="text-muted-foreground text-lg">Upload your resume and get instant AI-powered feedback.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1 space-y-6">
            <GlassCard className="border-primary/10">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Upload Resume
              </h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Resume File (PDF/DOCX)</Label>
                  <div className="relative border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer group bg-white/5">
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleFileChange}
                      accept=".pdf,.docx,.txt"
                    />
                    {file ? (
                      <div className="flex flex-col items-center">
                        <FileCheck className="w-12 h-12 text-green-500 mb-2" />
                        <span className="font-medium text-sm truncate max-w-full">{file.name}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="w-12 h-12 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
                        <span className="text-sm text-muted-foreground">Click or drag to upload</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Target Job Role</Label>
                  <Select onValueChange={setJobRole}>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AI/ML Engineer">AI/ML Engineer</SelectItem>
                      <SelectItem value="Accountant">Accountant</SelectItem>
                      <SelectItem value="Backend Developer">Backend Developer</SelectItem>
                      <SelectItem value="Business Analyst">Business Analyst</SelectItem>
                      <SelectItem value="Cloud Architect">Cloud Architect</SelectItem>
                      <SelectItem value="Content Writer">Content Writer</SelectItem>
                      <SelectItem value="Customer Success Manager">Customer Success Manager</SelectItem>
                      <SelectItem value="Cybersecurity Analyst">Cybersecurity Analyst</SelectItem>
                      <SelectItem value="Data Analyst">Data Analyst</SelectItem>
                      <SelectItem value="Data Engineer">Data Engineer</SelectItem>
                      <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                      <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
                      <SelectItem value="Digital Marketing Specialist">Digital Marketing Specialist</SelectItem>
                      <SelectItem value="Financial Analyst">Financial Analyst</SelectItem>
                      <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
                      <SelectItem value="Full Stack Developer">Full Stack Developer</SelectItem>
                      <SelectItem value="Graphic Designer">Graphic Designer</SelectItem>
                      <SelectItem value="HR Manager">HR Manager</SelectItem>
                      <SelectItem value="Legal Consultant">Legal Consultant</SelectItem>
                      <SelectItem value="Marketing Manager">Marketing Manager</SelectItem>
                      <SelectItem value="Mobile App Developer">Mobile App Developer</SelectItem>
                      <SelectItem value="Operations Manager">Operations Manager</SelectItem>
                      <SelectItem value="Product Designer">Product Designer</SelectItem>
                      <SelectItem value="Product Manager">Product Manager</SelectItem>
                      <SelectItem value="Project Manager">Project Manager</SelectItem>
                      <SelectItem value="QA Engineer">QA Engineer</SelectItem>
                      <SelectItem value="Sales Executive">Sales Executive</SelectItem>
                      <SelectItem value="Software Engineer">Software Engineer</SelectItem>
                      <SelectItem value="System Administrator">System Administrator</SelectItem>
                      <SelectItem value="Technical Recruiter">Technical Recruiter</SelectItem>
                      <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Select onValueChange={setIndustry}>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aerospace">Aerospace</SelectItem>
                      <SelectItem value="Agriculture">Agriculture</SelectItem>
                      <SelectItem value="Automotive">Automotive</SelectItem>
                      <SelectItem value="Construction">Construction</SelectItem>
                      <SelectItem value="Consulting">Consulting</SelectItem>
                      <SelectItem value="Consumer Electronics">Consumer Electronics</SelectItem>
                      <SelectItem value="E-commerce">E-commerce</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Energy & Utilities">Energy & Utilities</SelectItem>
                      <SelectItem value="Fashion & Apparel">Fashion & Apparel</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                      <SelectItem value="Gaming">Gaming</SelectItem>
                      <SelectItem value="Government">Government</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Hospitality & Tourism">Hospitality & Tourism</SelectItem>
                      <SelectItem value="Insurance">Insurance</SelectItem>
                      <SelectItem value="Legal Services">Legal Services</SelectItem>
                      <SelectItem value="Logistics & Supply Chain">Logistics & Supply Chain</SelectItem>
                      <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="Media & Entertainment">Media & Entertainment</SelectItem>
                      <SelectItem value="Mining">Mining</SelectItem>
                      <SelectItem value="Non-profit">Non-profit</SelectItem>
                      <SelectItem value="Pharmaceuticals">Pharmaceuticals</SelectItem>
                      <SelectItem value="Real Estate">Real Estate</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Telecommunications">Telecommunications</SelectItem>
                      <SelectItem value="Venture Capital">Venture Capital</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-lg shadow-lg shadow-primary/20"
                  onClick={handleAnalyze}
                  disabled={loading}
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Analyzing...</>
                  ) : (
                    <><Zap className="w-5 h-5 mr-2" /> Analyze Resume</>
                  )}
                </Button>
              </div>
            </GlassCard>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {results ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  {/* Score Card */}
                  <GlassCard className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="space-y-2 text-center md:text-left">
                        <h3 className="text-2xl font-bold">ATS Score</h3>
                        <p className="text-muted-foreground">Based on industry standards and role relevance.</p>
                      </div>
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-white/10"
                          />
                          <circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={364}
                            strokeDashoffset={364 - (364 * results.atsScore) / 100}
                            className="text-primary transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <span className="absolute text-3xl font-bold">{results.atsScore}%</span>
                      </div>
                    </div>
                  </GlassCard>

                  {/* Detailed Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <GlassCard>
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        Matched Keywords
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {results.matchedKeywords?.map((kw, i) => (
                          <span key={i} className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm font-medium border border-green-500/20">
                            {kw}
                          </span>
                        )) || <span className="text-muted-foreground text-sm italic">No specific strengths identified yet.</span>}
                      </div>
                    </GlassCard>

                    <GlassCard>
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                        Missing Keywords
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {results.missingKeywords?.map((kw, i) => (
                           <span key={i} className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-sm font-medium border border-amber-500/20">
                             {kw}
                           </span>
                        )) || <span className="text-muted-foreground text-sm italic">No missing keywords found.</span>}
                      </div>
                    </GlassCard>
                  </div>

                  {/* AI Feedback Summary */}
                  <GlassCard className="border-indigo-500/20">
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                       <Zap className="w-6 h-6 text-indigo-500" />
                       Intelligence Summary
                    </h3>
                    <p className="text-muted-foreground italic mb-6">
                      "{results.aiAnalysis.summary}"
                    </p>
                    
                    <div className="space-y-4">
                      <h4 className="font-bold text-lg text-primary">Top Priority Improvements</h4>
                      <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {results.aiAnalysis?.topImprovements?.map((imp, i) => (
                          <li key={i} className="p-3 bg-primary/5 border border-primary/10 rounded-xl text-sm">
                            <span className="font-bold mr-2 text-primary">{i+1}.</span>
                            {imp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </GlassCard>

                  {/* Detailed Section Evaluation */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Detailed Evaluation (10 Sections)</h3>
                    <Accordion type="single" collapsible className="space-y-4">
                      {results.aiAnalysis?.sections?.map((section, idx) => (
                        <AccordionItem 
                          key={idx} 
                          value={`section-${idx}`}
                          className="border border-white/10 rounded-2xl overflow-hidden glass-morphism px-1"
                        >
                          <AccordionTrigger className="hover:no-underline px-4 py-4">
                            <div className="flex items-center justify-between w-full pr-4">
                              <span className="font-bold text-lg">{section.name}</span>
                              <div className="flex items-center gap-3">
                                <span className={`font-bold px-2 py-1 rounded-md text-sm ${
                                  section.score >= 8 ? "bg-green-500/20 text-green-500" :
                                  section.score >= 5 ? "bg-amber-500/20 text-amber-500" :
                                  "bg-red-500/20 text-red-500"
                                }`}>
                                  {section.score}/10
                                </span>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-6 pt-2 border-t border-white/5">
                            <div className="space-y-6">
                               <p className="text-muted-foreground leading-relaxed">
                                 {section.analysis}
                               </p>
                               
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div className="space-y-3">
                                   <h5 className="font-bold text-green-500 flex items-center gap-2">
                                     <CheckCircle2 className="w-4 h-4" /> Strengths
                                   </h5>
                                   <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                     {section.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                                   </ul>
                                 </div>
                                 <div className="space-y-3">
                                   <h5 className="font-bold text-red-400 flex items-center gap-2">
                                     <AlertCircle className="w-4 h-4" /> Weaknesses
                                   </h5>
                                   <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                     {section.weaknesses?.map((w, i) => <li key={i}>{w}</li>)}
                                   </ul>
                                 </div>
                               </div>

                               <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl">
                                 <h5 className="font-bold text-primary mb-2 flex items-center gap-2">
                                   <Zap className="w-4 h-4" /> Improvement Suggestions
                                 </h5>
                                 <ul className="space-y-2">
                                   {section.suggestions?.map((s, i) => (
                                     <li key={i} className="text-sm text-muted-foreground flex gap-2">
                                       <span className="text-primary font-bold">•</span>
                                       {s}
                                     </li>
                                   ))}
                                 </ul>
                               </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-white/5 rounded-3xl bg-white/5">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Search className="w-10 h-10 text-primary/40" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">No Analysis Results</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Upload your resume and select your target role on the left to see your personalized analysis.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
