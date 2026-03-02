import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Loader2, Leaf, AlertTriangle, CheckCircle2, Trash2, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Layout from "@/components/Layout";

interface WasteResult {
  category: string;
  confidence: number;
  disposal: string;
  impact: string;
  image: string;
}

const mockResults: WasteResult[] = [
  {
    category: "Recyclable – Plastic (PET)",
    confidence: 94,
    disposal: "Rinse and place in your blue recycling bin. Remove caps and labels if possible.",
    impact: "Recycling this item saves ~1.5 kg of CO₂ emissions.",
    image: "",
  },
  {
    category: "Organic – Food Waste",
    confidence: 88,
    disposal: "Place in compost bin or green waste collection. Avoid mixing with non-organic waste.",
    impact: "Composting reduces methane emissions from landfills by up to 60%.",
    image: "",
  },
  {
    category: "Hazardous – E-Waste",
    confidence: 91,
    disposal: "Take to a certified e-waste collection center. Do not dispose in regular bins.",
    impact: "Proper disposal prevents toxic chemicals from contaminating soil and water.",
    image: "",
  },
];

const pastHistory: { category: string; date: string; confidence: number }[] = [
  { category: "Recyclable – Paper", date: "Feb 28, 2026", confidence: 96 },
  { category: "Organic – Garden Waste", date: "Feb 25, 2026", confidence: 89 },
  { category: "Hazardous – Battery", date: "Feb 20, 2026", confidence: 93 },
];

const IdentifyWaste = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<WasteResult | null>(null);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const analyze = () => {
    setAnalyzing(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setAnalyzing(false);
          const r = mockResults[Math.floor(Math.random() * mockResults.length)];
          setResult({ ...r, image: preview || "" });
          return 100;
        }
        return p + Math.random() * 15 + 5;
      });
    }, 200);
  };

  const clear = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setProgress(0);
  };

  return (
    <Layout>
      <section className="hero-bg min-h-[calc(100vh-4rem)] py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
              <span className="eco-gradient-text">AI Waste</span> Identification
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Upload an image of waste and our AI will classify it, providing
              disposal instructions and environmental impact information.
            </p>
          </motion.div>

          {/* Upload zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card p-8 mb-8"
          >
            {!preview ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-primary/30 rounded-2xl p-16 text-center cursor-pointer hover:border-primary/60 transition-colors"
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <Upload className="h-12 w-12 text-primary mx-auto mb-4 animate-float" />
                <p className="font-semibold text-lg mb-1">Drag & drop your waste image here</p>
                <p className="text-sm text-muted-foreground mb-4">or click to browse files</p>
                <Button variant="outline" size="sm" className="rounded-xl">
                  Browse Files
                </Button>
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative rounded-2xl overflow-hidden max-h-80 flex justify-center bg-muted/30">
                  <img
                    src={preview}
                    alt="Preview"
                    className="object-contain max-h-80"
                  />
                  <button
                    onClick={clear}
                    className="absolute top-3 right-3 bg-foreground/70 text-background rounded-full p-1.5 hover:bg-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {analyzing && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm font-medium text-primary">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing waste with AI...
                    </div>
                    <Progress value={Math.min(progress, 100)} className="h-2" />
                  </div>
                )}

                {!result && !analyzing && (
                  <div className="flex gap-3 justify-center">
                    <Button onClick={analyze} className="rounded-xl px-8">
                      <Leaf className="mr-2 h-4 w-4" />
                      Analyze Waste
                    </Button>
                    <Button variant="outline" onClick={clear} className="rounded-xl">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear
                    </Button>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Result */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card p-8 mb-8 space-y-6"
              >
                <div className="flex items-start gap-4">
                  <div className="eco-gradient-bg rounded-xl p-3 shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{result.category}</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-2 flex-1 max-w-48 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full eco-gradient-bg rounded-full transition-all duration-700"
                          style={{ width: `${result.confidence}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-primary">
                        {result.confidence}% confidence
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-secondary/50 rounded-xl p-5">
                    <h4 className="font-semibold text-sm text-secondary-foreground mb-2 flex items-center gap-2">
                      <Trash2 className="h-4 w-4" /> Disposal Instructions
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {result.disposal}
                    </p>
                  </div>
                  <div className="bg-secondary/50 rounded-xl p-5">
                    <h4 className="font-semibold text-sm text-secondary-foreground mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" /> Environmental Impact
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {result.impact}
                    </p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button variant="outline" onClick={clear} className="rounded-xl">
                    Analyze Another Image
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-8"
          >
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Recent Analyses
            </h3>
            <div className="space-y-3">
              {pastHistory.map((h, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-secondary/30 rounded-xl p-4"
                >
                  <div>
                    <p className="font-medium text-sm">{h.category}</p>
                    <p className="text-xs text-muted-foreground">{h.date}</p>
                  </div>
                  <span className="text-sm font-semibold text-primary">
                    {h.confidence}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default IdentifyWaste;
