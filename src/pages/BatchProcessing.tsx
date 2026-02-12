import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Upload, Loader2, Download, ChevronsUpDown, Search,
  ChevronDown, ChevronUp, Copy, Mail, Linkedin, MessageCircle, Smartphone, Instagram,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { batchProcess } from "@/api/client";
import { getSettings } from "@/hooks/useSettings";
import { useClipboard } from "@/hooks/useClipboard";
import type { BatchResult } from "@/types";
import { cn } from "@/lib/utils";

export default function BatchProcessing() {
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [urlColumnIndex, setUrlColumnIndex] = useState<number>(-1);
  const [offering, setOffering] = useState(getSettings().offering);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [results, setResults] = useState<BatchResult[]>([]);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const { copy } = useClipboard();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text.split("\n").map((r) => r.split(",").map((c) => c.trim().replace(/^"|"$/g, "")));
      if (rows.length < 2) return toast.error("CSV must have headers and data");
      const headers = rows[0];
      setCsvHeaders(headers);
      setCsvData(rows.slice(1).filter((r) => r.some((c) => c)));
      const urlIdx = headers.findIndex((h) =>
        /linkedin|url/i.test(h)
      );
      setUrlColumnIndex(urlIdx >= 0 ? urlIdx : 0);
      setResults([]);
      toast.success(`CSV loaded: ${rows.length - 1} rows`);
    };
    reader.readAsText(file);
  };

  const handleProcess = async () => {
    if (urlColumnIndex < 0 || csvData.length === 0) return toast.error("Upload a CSV first");
    if (!offering.trim()) return toast.error("Set your offering");
    const urls = csvData.map((row) => row[urlColumnIndex]).filter(Boolean);
    setProcessing(true);
    setProgress(0);
    setStatusText(`Processing 0/${urls.length}...`);
    try {
      const res = await batchProcess({ urls, offering });
      setResults(res.data);
      toast.success("Batch processing complete!");
    } catch {
      toast.error("Batch processing failed");
    } finally {
      setProcessing(false);
      setProgress(100);
      setStatusText("Done");
    }
  };

  const toggleCard = (i: number) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const expandAll = () => setExpandedCards(new Set(results.map((_, i) => i)));
  const collapseAll = () => setExpandedCards(new Set());

  const filteredResults = useMemo(() => {
    return results.filter((r) => {
      const matchesSearch = !searchQuery || [r.name, r.company, r.role].some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === "All" || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [results, searchQuery, statusFilter]);

  const stats = useMemo(() => ({
    success: results.filter((r) => r.status === "Success").length,
    partial: results.filter((r) => r.status === "Partial").length,
    failed: results.filter((r) => r.status === "Failed").length,
  }), [results]);

  const downloadCSV = () => {
    const headers = ["Name", "Company", "Role", "Status", "Email Subject", "Email Body", "LinkedIn", "WhatsApp", "SMS", "Instagram"];
    const rows = results.map((r) => [r.name, r.company, r.role, r.status, r.email_subject, r.email_body, r.linkedin_msg, r.whatsapp_msg, r.sms_msg, r.instagram_msg]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${(c || "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "outreach_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Upload */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>Batch Processing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-border/60 rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors relative">
            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">Drop a CSV file here or click to upload</p>
            <input
              type="file"
              accept=".csv"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileUpload}
            />
          </div>

          {csvHeaders.length > 0 && (
            <>
              <div className="rounded-lg border border-border/50 overflow-auto max-h-48">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-secondary/50">
                      {csvHeaders.map((h, i) => (
                        <th key={i} className={cn("px-3 py-2 text-left font-medium", i === urlColumnIndex && "text-primary")}>
                          {h} {i === urlColumnIndex && "🔗"}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.slice(0, 5).map((row, i) => (
                      <tr key={i} className="border-t border-border/30">
                        {row.map((cell, j) => (
                          <td key={j} className="px-3 py-1.5 text-muted-foreground truncate max-w-[200px]">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground">
                Showing first {Math.min(csvData.length, 5)} of {csvData.length} rows. URL column: <strong>{csvHeaders[urlColumnIndex]}</strong>
              </p>
            </>
          )}

          <div className="space-y-2">
            <Label>Your Offering</Label>
            <Textarea value={offering} onChange={(e) => setOffering(e.target.value)} rows={2} placeholder="What you sell..." />
          </div>

          <Button onClick={handleProcess} disabled={processing || csvData.length === 0} className="gradient-primary gap-2">
            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Process All Profiles
          </Button>

          {processing && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground">{statusText}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          {/* Bulk actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm" variant="outline" onClick={expandAll} className="gap-1"><ChevronsUpDown className="w-3 h-3" /> Expand All</Button>
            <Button size="sm" variant="outline" onClick={collapseAll} className="gap-1">Collapse All</Button>
            <Button size="sm" variant="outline" onClick={downloadCSV} className="gap-1"><Download className="w-3 h-3" /> Download CSV</Button>
            <div className="flex-1" />
            <span className="text-xs">✅ {stats.success} Success</span>
            <span className="text-xs">⚠️ {stats.partial} Partial</span>
            <span className="text-xs">❌ {stats.failed} Failed</span>
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by name, company, role..." className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Success">Success</SelectItem>
                <SelectItem value="Partial">Partial</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredResults.map((result, index) => (
            <BatchResultCard
              key={index}
              result={result}
              expanded={expandedCards.has(index)}
              onToggle={() => toggleCard(index)}
              onCopy={copy}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function BatchResultCard({ result, expanded, onToggle, onCopy }: {
  result: BatchResult;
  expanded: boolean;
  onToggle: () => void;
  onCopy: (text: string, label?: string) => void;
}) {
  const statusColors: Record<string, string> = {
    Success: "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]",
    Partial: "bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))]",
    Failed: "bg-destructive text-destructive-foreground",
  };

  const initials = result.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const channels = [
    { key: "email", label: "Email", icon: Mail },
    { key: "linkedin_msg", label: "LinkedIn", icon: Linkedin },
    { key: "whatsapp_msg", label: "WhatsApp", icon: MessageCircle },
    { key: "sms_msg", label: "SMS", icon: Smartphone },
    { key: "instagram_msg", label: "Instagram", icon: Instagram },
  ];

  return (
    <Card className="glass border-border/50 overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center gap-4 p-4 hover:bg-accent/30 transition-colors text-left">
        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{result.name}</p>
          <p className="text-xs text-muted-foreground truncate">{result.company} · {result.role}</p>
        </div>
        <Badge className={cn("border-0 text-xs", statusColors[result.status])}>{result.status}</Badge>
        {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      {expanded && (
        <CardContent className="pt-0 pb-4">
          <Tabs defaultValue="email">
            <TabsList className="w-full flex">
              {channels.map((ch) => (
                <TabsTrigger key={ch.key} value={ch.key} className="flex-1 gap-1 text-xs">
                  <ch.icon className="w-3 h-3" /> {ch.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="email" className="mt-3 space-y-3">
              <MsgBlock label="Subject" text={result.email_subject} onCopy={onCopy} />
              <MsgBlock label="Body" text={result.email_body} onCopy={onCopy} />
            </TabsContent>

            {channels.filter((c) => c.key !== "email").map((ch) => {
              const text = (result as unknown as Record<string, string>)[ch.key] || "";
              return (
                <TabsContent key={ch.key} value={ch.key} className="mt-3">
                  <MsgBlock label={ch.label} text={text} onCopy={onCopy} />
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
}

function MsgBlock({ label, text, onCopy }: { label: string; text: string; onCopy: (t: string, l?: string) => void }) {
  if (!text) {
    return <p className="text-sm text-muted-foreground italic">No message generated</p>;
  }
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <Button size="sm" variant="ghost" className="gap-1 h-6 text-xs" onClick={() => onCopy(text, label)}>
          <Copy className="w-3 h-3" /> Copy
        </Button>
      </div>
      <div className="bg-secondary/50 rounded-lg p-3 text-sm whitespace-pre-wrap">{text}</div>
    </div>
  );
}
