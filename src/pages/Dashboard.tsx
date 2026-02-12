import { Link } from "react-router-dom";
import { User, Users, Zap, Target, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Profiles Processed", value: "0", icon: Target, color: "text-primary" },
  { label: "Success Rate", value: "—", icon: TrendingUp, color: "text-[hsl(var(--success))]" },
  { label: "Recent Activity", value: "None yet", icon: Clock, color: "text-[hsl(var(--warning))]" },
];

export default function Dashboard() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hero */}
      <div className="glass rounded-2xl p-8 glow-primary text-center">
        <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
          <Zap className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold gradient-text mb-2">
          Welcome to OutreachAI
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          AI-powered cold outreach that scrapes profiles, analyzes them with LLMs, and generates hyper-personalized messages across 5 channels.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="glass border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button asChild size="lg" className="h-auto py-6 gradient-primary hover:opacity-90 rounded-xl">
          <Link to="/profile" className="flex flex-col items-center gap-2">
            <User className="w-6 h-6" />
            <span className="text-base font-semibold">Analyze a Profile</span>
            <span className="text-xs opacity-80">Single LinkedIn profile analysis</span>
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-auto py-6 glass border-border/50 hover:bg-accent/50 rounded-xl">
          <Link to="/batch" className="flex flex-col items-center gap-2">
            <Users className="w-6 h-6" />
            <span className="text-base font-semibold">Start Batch Processing</span>
            <span className="text-xs opacity-80">Process multiple profiles via CSV</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
