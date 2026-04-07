import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, FileText, ImagePlus, Tag, CheckCircle2,
  ArrowRight, ArrowLeft, Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const steps = [
  { label: "Location", icon: MapPin },
  { label: "Details", icon: FileText },
  { label: "Evidence", icon: ImagePlus },
  { label: "Category", icon: Tag },
];

const categories = [
  "Illegal Dumping",
  "Industrial Pollution",
  "Water Contamination",
  "Air Quality Violation",
  "Deforestation",
  "Other",
];

const ReportViolation = () => {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [evidencePreview, setEvidencePreview] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const canNext = () => {
    if (step === 0) return location.trim().length > 2;
    if (step === 1) return description.trim().length > 10;
    if (step === 2) return true;
    if (step === 3) return category.length > 0;
    return false;
  };

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    const generatedRefId = `ECO-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;

    try {
      const { error } = await supabase.from("violation_reports").insert({
        user_id: user.id,
        reference_id: generatedRefId,
        location,
        description,
        category,
        image_url: evidencePreview || null,
        status: "Submitted",
      });

      if (error) throw error;

      setRefId(generatedRefId);
      setSubmitted(true);
      toast({ title: "Report submitted!", description: `Reference: ${generatedRefId}` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Layout>
        <section className="hero-bg min-h-[calc(100vh-4rem)] flex items-center justify-center py-16">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-12 text-center max-w-md">
            <div className="eco-gradient-bg w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Report Submitted!</h2>
            <p className="text-muted-foreground mb-6">Your environmental violation report has been filed successfully.</p>
            <p className="text-sm text-muted-foreground mb-6">Reference ID: <span className="font-mono font-semibold text-primary">{refId}</span></p>
            <Button onClick={() => { setSubmitted(false); setStep(0); setLocation(""); setDescription(""); setEvidencePreview(null); setCategory(""); }} className="rounded-xl">
              File Another Report
            </Button>
          </motion.div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="hero-bg min-h-[calc(100vh-4rem)] py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Report <span className="eco-gradient-text">Violation</span></h1>
            <p className="text-muted-foreground">Help protect the environment by reporting violations in your area.</p>
          </motion.div>

          {/* Progress */}
          <div className="flex items-center justify-between mb-10 px-4">
            {steps.map((s, i) => (
              <div key={s.label} className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${i <= step ? "eco-gradient-bg text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {i < step ? <CheckCircle2 className="h-5 w-5" /> : <s.icon className="h-4 w-4" />}
                </div>
                <span className="hidden sm:inline text-sm font-medium text-muted-foreground">{s.label}</span>
                {i < steps.length - 1 && <div className={`hidden sm:block w-8 md:w-16 h-0.5 mx-1 rounded-full ${i < step ? "eco-gradient-bg" : "bg-muted"}`} />}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <div className="space-y-4">
                  <label className="font-semibold text-sm">Location of Violation</label>
                  <Input placeholder="Enter address, city, or coordinates" value={location} onChange={(e) => setLocation(e.target.value)} className="rounded-xl h-12" />
                  <div className="bg-muted/50 rounded-2xl h-48 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <p className="text-sm">{location ? `📍 ${location}` : "Map preview will appear here"}</p>
                    </div>
                  </div>
                </div>
              )}
              {step === 1 && (
                <div className="space-y-4">
                  <label className="font-semibold text-sm">Describe the Violation</label>
                  <Textarea placeholder="Provide a detailed description..." value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-xl min-h-40" />
                </div>
              )}
              {step === 2 && (
                <div className="space-y-4">
                  <label className="font-semibold text-sm">Upload Evidence (Optional)</label>
                  {!evidencePreview ? (
                    <div className="border-2 border-dashed border-primary/30 rounded-2xl p-12 text-center cursor-pointer hover:border-primary/60 transition-colors" onClick={() => document.getElementById("evidence-input")?.click()}>
                      <ImagePlus className="h-10 w-10 text-primary mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">Click to upload photos or videos</p>
                      <input id="evidence-input" type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { const reader = new FileReader(); reader.onload = (ev) => setEvidencePreview(ev.target?.result as string); reader.readAsDataURL(f); } }} />
                    </div>
                  ) : (
                    <div className="relative rounded-2xl overflow-hidden">
                      <img src={evidencePreview} alt="Evidence" className="w-full max-h-64 object-cover rounded-2xl" />
                      <button onClick={() => setEvidencePreview(null)} className="absolute top-2 right-2 bg-foreground/70 text-background rounded-full p-1.5">✕</button>
                    </div>
                  )}
                </div>
              )}
              {step === 3 && (
                <div className="space-y-4">
                  <label className="font-semibold text-sm">Violation Category</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="rounded-xl h-12"><SelectValue placeholder="Select a category" /></SelectTrigger>
                    <SelectContent>{categories.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
              )}
            </AnimatePresence>

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={step === 0} className="rounded-xl">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              {step < 3 ? (
                <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext()} className="rounded-xl">
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={!canNext() || submitting} className="rounded-xl">
                  <Send className="mr-2 h-4 w-4" /> {submitting ? "Submitting..." : "Submit Report"}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default ReportViolation;
