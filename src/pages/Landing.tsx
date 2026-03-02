import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Leaf,
  ScanSearch,
  Shield,
  Scale,
  TrendingUp,
  FileCheck,
  Gavel,
  ArrowRight,
  Recycle,
  Globe,
  BarChart3,
} from "lucide-react";
import Layout from "@/components/Layout";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const features = [
  {
    icon: ScanSearch,
    title: "AI Waste Detection",
    desc: "Upload an image and our AI classifies waste type with disposal instructions instantly.",
  },
  {
    icon: Shield,
    title: "Violation Reporting",
    desc: "Report environmental violations with evidence. Track your complaints in real-time.",
  },
  {
    icon: Scale,
    title: "Legal Assistance",
    desc: "Connect with environmental lawyers for consultations and legal guidance.",
  },
  {
    icon: BarChart3,
    title: "Smart Dashboard",
    desc: "Track your impact with comprehensive analytics and activity timelines.",
  },
];

const stats = [
  { value: "2.4M+", label: "Waste Items Identified", icon: Recycle },
  { value: "18K+", label: "Reports Filed", icon: FileCheck },
  { value: "3.2K+", label: "Legal Cases Resolved", icon: Gavel },
  { value: "150+", label: "Cities Covered", icon: Globe },
];

const Landing = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="hero-bg relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-accent/10 blur-3xl animate-pulse-soft" />

        <div className="container mx-auto px-4 py-28 md:py-40 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Leaf className="h-4 w-4" />
              AI-Powered Environmental Platform
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6">
              <span className="eco-gradient-text">AI-Powered</span> Waste
              Segregation for{" "}
              <span className="eco-gradient-text">Smart Cities</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Identify waste types, report environmental violations, and access
              legal aid — all powered by cutting-edge artificial intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-base px-8 h-12 rounded-xl">
                <Link to="/identify">
                  <ScanSearch className="mr-2 h-5 w-5" />
                  Upload Waste Image
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-base px-8 h-12 rounded-xl border-primary/30 hover:bg-primary/5"
              >
                <Link to="/report">
                  <Shield className="mr-2 h-5 w-5" />
                  Report Violation
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need for a{" "}
              <span className="eco-gradient-text">greener future</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A comprehensive platform combining AI technology with
              environmental advocacy.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="glass-card p-6 card-hover group"
              >
                <div className="eco-gradient-bg w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 hero-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/[0.02]" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Making a <span className="eco-gradient-text">real impact</span>
            </h2>
            <p className="text-muted-foreground">
              Numbers that reflect our commitment to the environment.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="stat-card"
              >
                <s.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-3xl md:text-4xl font-extrabold eco-gradient-text mb-1">
                  {s.value}
                </div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            {...fadeUp}
            className="glass-card p-12 md:p-16 text-center max-w-3xl mx-auto eco-gradient-bg rounded-3xl"
          >
            <TrendingUp className="h-10 w-10 text-primary-foreground mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to make a difference?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
              Join thousands of citizens using AI to protect our environment.
            </p>
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="text-base px-8 h-12 rounded-xl"
            >
              <Link to="/identify">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Landing;
