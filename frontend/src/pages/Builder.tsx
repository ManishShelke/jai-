import { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Send, Download, Sparkles, Loader2, CheckCircle2 } from "lucide-react";

import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";

interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experience: {
    company: string;
    position: string;
    duration: string;
    description: string;
  }[];
  education: {
    school: string;
    degree: string;
    year: string;
  }[];
  skills: string[];
}

interface BuildResponse {
  resumeData: ResumeData;
  chatResponse: string;
}

const initialResumeData: ResumeData = {
  personalInfo: { fullName: "", email: "", phone: "", location: "", summary: "" },
  experience: [],
  education: [],
  skills: []
};

const GuideStep = ({ step, title, completed }: { step: number; title: string; completed: boolean }) => (
  <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
    completed ? "bg-green-500/10 border-green-500/20" : "bg-white/5 border-white/10"
  }`}>
    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
      completed ? "bg-green-500 text-white" : "bg-primary/20 text-primary"
    }`}>
      {completed ? <CheckCircle2 className="w-5 h-5" /> : step}
    </div>
    <span className={`text-sm font-medium ${completed ? "text-green-500" : "text-muted-foreground"}`}>{title}</span>
  </div>
);

const Builder = () => {
  const { toast } = useToast();
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/build", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          currentData: resumeData,
          userMessage,
          history: messages.slice(-5)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to get AI response");
      }

      const data: BuildResponse = await response.json();
      setResumeData(data.resumeData);
      setMessages(prev => [...prev, { role: "assistant", content: data.chatResponse }]);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const { personalInfo, experience, education, skills } = resumeData;
    
    doc.setFontSize(22);
    doc.text(personalInfo.fullName || "Your Name", 20, 20);
    
    doc.setFontSize(10);
    doc.text(`${personalInfo.email} | ${personalInfo.phone} | ${personalInfo.location}`, 20, 28);
    
    doc.setFontSize(14);
    doc.text("Professional Summary", 20, 40);
    doc.setFontSize(10);
    const splitSummary = doc.splitTextToSize(personalInfo.summary, 170);
    doc.text(splitSummary, 20, 46);
    
    let y = 46 + (splitSummary.length * 5) + 10;
    
    doc.setFontSize(14);
    doc.text("Experience", 20, y);
    y += 8;
    experience.forEach(exp => {
      doc.setFontSize(12);
      doc.text(`${exp.position} at ${exp.company}`, 20, y);
      doc.setFontSize(10);
      doc.text(exp.duration, 160, y, { align: "right" });
      y += 5;
      const splitDesc = doc.splitTextToSize(exp.description, 170);
      doc.text(splitDesc, 20, y);
      y += (splitDesc.length * 5) + 5;
    });
    
    doc.save("resume.pdf");
    toast({ title: "Success", description: "PDF downloaded successfully!" });
  };

  const downloadDOCX = async () => {
    const { personalInfo, experience, education, skills } = resumeData;
    
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: personalInfo.fullName || "Your Name",
            heading: HeadingLevel.TITLE,
          }),
          new Paragraph({
            children: [
              new TextRun(`${personalInfo.email} | ${personalInfo.phone} | ${personalInfo.location}`),
            ],
          }),
          new Paragraph({ text: "Professional Summary", heading: HeadingLevel.HEADING_1 }),
          new Paragraph({ text: personalInfo.summary }),
          new Paragraph({ text: "Experience", heading: HeadingLevel.HEADING_1 }),
          ...experience.flatMap(exp => [
            new Paragraph({
              children: [
                new TextRun({ text: `${exp.position} at ${exp.company}`, bold: true }),
                new TextRun({ text: `\t${exp.duration}`, italics: true }),
              ],
            }),
            new Paragraph({ text: exp.description }),
          ]),
          new Paragraph({ text: "Skills", heading: HeadingLevel.HEADING_1 }),
          new Paragraph({ text: skills.join(", ") }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "resume.docx");
    toast({ title: "Success", description: "DOCX downloaded successfully!" });
  };

  return (
    <Layout>
      <div className="py-6 h-[calc(100vh-160px)] flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">AI Resume Builder</h1>
            <p className="text-muted-foreground">Chat with AI to craft your professional resume from scratch.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={downloadPDF} className="glass-morphism border-primary/20">
              <Download className="w-4 h-4 mr-2" /> PDF
            </Button>
            <Button variant="outline" onClick={downloadDOCX} className="glass-morphism border-primary/20">
              <Download className="w-4 h-4 mr-2" /> DOCX
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
          <GuideStep step={1} title="Personal Info" completed={!!resumeData.personalInfo.fullName} />
          <GuideStep step={2} title="Work Experience" completed={resumeData.experience.length > 0} />
          <GuideStep step={3} title="Education" completed={resumeData.education.length > 0} />
          <GuideStep step={4} title="Skills" completed={resumeData.skills.length > 0} />
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
          {/* Chat Interface */}
          <GlassCard className="flex flex-col p-0 overflow-hidden border-primary/10">
            <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-bold">Resume Assistant</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
                  <Sparkles className="w-12 h-12 mb-4 text-primary" />
                  <p className="text-lg font-medium">Hello! I'm your AI Resume Assistant.</p>
                  <p className="text-sm">Tell me about your experience, or just say "Let's start" to begin.</p>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl ${
                    m.role === "user" 
                      ? "bg-primary text-white rounded-tr-none" 
                      : "bg-white/10 border border-white/10 rounded-tl-none"
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t border-white/10 bg-white/5 flex gap-2">
              <Input
                placeholder="Ask AI to add experience, update skills..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="bg-white/5 border-white/10 focus-visible:ring-primary"
                disabled={loading}
              />
              <Button onClick={handleSendMessage} disabled={loading || !input.trim()}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </GlassCard>

          {/* Preview Interface */}
          <GlassCard className="bg-white p-8 text-black overflow-y-auto font-serif shadow-2xl">
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Header */}
              <div className="text-center border-b-2 border-gray-900 pb-4">
                <h2 className="text-3xl font-bold uppercase tracking-wider">{resumeData.personalInfo.fullName || "YOUR NAME"}</h2>
                <p className="text-sm text-gray-600 mt-2">
                  {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email} • </span>}
                  {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone} • </span>}
                  {resumeData.personalInfo.location}
                </p>
              </div>

              {/* Summary */}
              {resumeData.personalInfo.summary && (
                <section>
                  <h3 className="text-lg font-bold border-b border-gray-300 uppercase mb-2">Professional Summary</h3>
                  <p className="text-sm leading-relaxed">{resumeData.personalInfo.summary}</p>
                </section>
              )}

              {/* Experience */}
              <section>
                <h3 className="text-lg font-bold border-b border-gray-300 uppercase mb-3">Work Experience</h3>
                <div className="space-y-4">
                  {resumeData.experience.map((exp, i) => (
                    <div key={i}>
                      <div className="flex justify-between font-bold">
                        <span>{exp.position}</span>
                        <span>{exp.duration}</span>
                      </div>
                      <div className="italic text-gray-700 mb-1">{exp.company}</div>
                      <p className="text-sm whitespace-pre-line">{exp.description}</p>
                    </div>
                  ))}
                  {resumeData.experience.length === 0 && (
                    <p className="text-sm text-gray-400 italic">No experience added yet.</p>
                  )}
                </div>
              </section>

              {/* Education */}
              <section>
                <h3 className="text-lg font-bold border-b border-gray-300 uppercase mb-3">Education</h3>
                <div className="space-y-3">
                  {resumeData.education.map((edu, i) => (
                    <div key={i}>
                      <div className="flex justify-between font-bold">
                        <span>{edu.degree}</span>
                        <span>{edu.year}</span>
                      </div>
                      <div className="text-sm">{edu.school}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Skills */}
              <section>
                <h3 className="text-lg font-bold border-b border-gray-300 uppercase mb-2">Technical Skills</h3>
                <p className="text-sm">{resumeData.skills.join(", ")}</p>
              </section>
            </div>
          </GlassCard>
        </div>
      </div>
    </Layout>
  );
};

export default Builder;
