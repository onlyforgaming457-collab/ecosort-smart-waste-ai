import { Leaf } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm">
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="eco-gradient-bg rounded-xl p-1.5">
            <Leaf className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold eco-gradient-text">EcoSort</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © 2026 EcoSort. AI-Powered Waste Segregation for Smart Cities.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
