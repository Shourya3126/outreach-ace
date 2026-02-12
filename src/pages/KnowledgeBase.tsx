import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, BookOpen, Database } from "lucide-react";
import { getKnowledge, deleteKnowledge } from "@/api/client";
import type { KnowledgeProspect } from "@/types";

export default function KnowledgeBase() {
  const [prospects, setProspects] = useState<KnowledgeProspect[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getKnowledge();
      setProspects(res.data);
    } catch {
      // API not connected — show empty state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteKnowledge(id);
      setProspects((prev) => prev.filter((p) => p.id !== id));
      toast.success("Prospect deleted");
    } catch {
      toast.error("Failed to delete prospect");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Knowledge Base
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : prospects.length === 0 ? (
            <div className="text-center py-12">
              <Database className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
              <p className="text-muted-foreground">No saved prospects yet</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Analyzed profiles will appear here once saved</p>
            </div>
          ) : (
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="px-4 py-3 text-left font-medium">Name</th>
                    <th className="px-4 py-3 text-left font-medium">Company</th>
                    <th className="px-4 py-3 text-left font-medium">Industry</th>
                    <th className="px-4 py-3 text-left font-medium">Date Saved</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {prospects.map((p) => (
                    <tr key={p.id} className="border-t border-border/30 hover:bg-accent/20 transition-colors">
                      <td className="px-4 py-3 font-medium">{p.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.company}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.industry}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.date_saved}</td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(p.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
