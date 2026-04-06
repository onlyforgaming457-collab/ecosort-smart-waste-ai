import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Star, MapPin, Clock, Phone, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import Layout from "@/components/Layout";
import { addActivity } from "@/lib/activityStore";
import { useToast } from "@/hooks/use-toast";

const lawyers = [
  { name: "Dr. Priya Sharma", specialty: "Environmental Litigation", location: "Mumbai, India", rating: 4.9, reviews: 128, available: true, image: "PS", experience: "15 years" },
  { name: "James O'Brien", specialty: "Waste Management Law", location: "London, UK", rating: 4.8, reviews: 96, available: true, image: "JO", experience: "12 years" },
  { name: "Anika Chen", specialty: "Climate Policy", location: "Singapore", rating: 4.7, reviews: 74, available: false, image: "AC", experience: "10 years" },
  { name: "Carlos Mendez", specialty: "Environmental Compliance", location: "Mexico City, MX", rating: 4.9, reviews: 110, available: true, image: "CM", experience: "18 years" },
  { name: "Sarah Williams", specialty: "Green Energy Regulation", location: "New York, US", rating: 4.6, reviews: 63, available: true, image: "SW", experience: "8 years" },
  { name: "Raj Patel", specialty: "Pollution Control Law", location: "Delhi, India", rating: 4.8, reviews: 89, available: false, image: "RP", experience: "14 years" },
];

const specialties = [...new Set(lawyers.map((l) => l.specialty))];
const locations = [...new Set(lawyers.map((l) => l.location))];

const LegalHelp = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [filterExpertise, setFilterExpertise] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const { toast } = useToast();

  const filtered = useMemo(() => {
    return lawyers
      .filter((l) => {
        const matchesSearch =
          l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          l.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
          l.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesExpertise = filterExpertise === "all" || l.specialty === filterExpertise;
        const matchesLocation = filterLocation === "all" || l.location === filterLocation;
        return matchesSearch && matchesExpertise && matchesLocation;
      })
      .sort((a, b) => {
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "reviews") return b.reviews - a.reviews;
        return a.name.localeCompare(b.name);
      });
  }, [searchTerm, sortBy, filterExpertise, filterLocation]);

  const handleBook = (lawyerName: string) => {
    addActivity(`Consultation booked with ${lawyerName}`, "legal");
    toast({ title: "Consultation Booked!", description: `You'll receive a confirmation for your session with ${lawyerName}.` });
  };

  return (
    <Layout>
      <section className="hero-bg min-h-[calc(100vh-4rem)] py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
              <span className="eco-gradient-text">Legal</span> Assistance
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Connect with experienced environmental lawyers for expert legal guidance and consultation.
            </p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-4 mb-8 space-y-3"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, specialty, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl h-11"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="rounded-xl h-11 w-44">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Top Rated</SelectItem>
                  <SelectItem value="reviews">Most Reviewed</SelectItem>
                  <SelectItem value="name">Alphabetical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={filterExpertise} onValueChange={setFilterExpertise}>
                <SelectTrigger className="rounded-xl h-11 flex-1">
                  <SelectValue placeholder="Filter by Expertise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Expertise</SelectItem>
                  {specialties.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterLocation} onValueChange={setFilterLocation}>
                <SelectTrigger className="rounded-xl h-11 flex-1">
                  <SelectValue placeholder="Filter by Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Lawyer Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No lawyers match your filters. Try adjusting your search.
              </div>
            ) : (
              filtered.map((lawyer, i) => (
                <motion.div
                  key={lawyer.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-6 card-hover flex flex-col"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="eco-gradient-bg w-14 h-14 rounded-2xl flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">
                      {lawyer.image}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold truncate">{lawyer.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{lawyer.specialty}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 flex-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />{lawyer.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 shrink-0" />{lawyer.experience} experience
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
                      <span className="font-semibold">{lawyer.rating}</span>
                      <span className="text-muted-foreground">({lawyer.reviews} reviews)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge
                      variant={lawyer.available ? "default" : "secondary"}
                      className={`rounded-full text-xs ${lawyer.available ? "bg-primary/10 text-primary border-primary/20" : ""}`}
                    >
                      {lawyer.available ? "Available" : "Unavailable"}
                    </Badge>
                    <Button
                      size="sm"
                      disabled={!lawyer.available}
                      className="rounded-xl text-xs"
                      onClick={() => handleBook(lawyer.name)}
                    >
                      <Phone className="mr-1.5 h-3 w-3" />
                      Book Consultation
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LegalHelp;
