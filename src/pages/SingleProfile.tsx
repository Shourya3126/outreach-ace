import { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, Upload, FileText, Search, Loader2 } from "lucide-react";
import { analyzeProfile } from "@/api/client";
import { getSettings } from "@/hooks/useSettings";
import type { AnalyzeResponse } from "@/types";
import { ProfileAnalysisCard } from "@/components/profile/ProfileAnalysisCard";
import { MessageTabs } from "@/components/profile/MessageTabs";

export default function SingleProfile() {
  const [inputType, setInputType] = useState<"url" | "file" | "text">("url");
  const [url, setUrl] = useState("");
  const [pastedText, setPastedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);

  const handleAnalyze = async () => {
    const settings = getSettings();
    if (!settings.offering) {
      toast.error("Please set your offering in Settings first.");
      return;
    }

    let data = "";
    if (inputType === "url") {
      if (!url.trim()) return toast.error("Enter a LinkedIn URL");
      data = url;
    } else if (inputType === "text") {
      if (!pastedText.trim()) return toast.error("Paste some text");
      data = pastedText;
    } else {
      toast.error("File upload will send the file content");
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const res = await analyzeProfile({
        input_type: inputType,
        data,
        offering: settings.offering,
      });
      setResult(res.data);
      toast.success("Profile analyzed successfully!");
    } catch {
      toast.error("Failed to analyze profile. Check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleVariant = async () => {
    if (!result) return;
    const settings = getSettings();
    setLoading(true);
    try {
      const data = inputType === "url" ? url : pastedText;
      const res = await analyzeProfile({
        input_type: inputType,
        data,
        offering: settings.offering,
        variant: true,
      });
      setResult(res.data);
      toast.success("A/B variant generated!");
    } catch {
      toast.error("Failed to generate variant.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Input Section */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>Analyze a Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={inputType} onValueChange={(v) => setInputType(v as "url" | "file" | "text")}>
            <TabsList className="mb-4">
              <TabsTrigger value="url" className="gap-2">
                <Link className="w-4 h-4" /> LinkedIn URL
              </TabsTrigger>
              <TabsTrigger value="file" className="gap-2">
                <Upload className="w-4 h-4" /> Upload Resume
              </TabsTrigger>
              <TabsTrigger value="text" className="gap-2">
                <FileText className="w-4 h-4" /> Paste Text
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-4">
              <div className="space-y-2">
                <Label>LinkedIn Profile URL</Label>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/johndoe"
                />
              </div>
            </TabsContent>

            <TabsContent value="file" className="space-y-4">
              <div className="border-2 border-dashed border-border/60 rounded-xl p-8 text-center text-muted-foreground">
                <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Drag & drop a PDF or DOCX, or click to browse</p>
                <input type="file" className="hidden" accept=".pdf,.docx" />
              </div>
            </TabsContent>

            <TabsContent value="text" className="space-y-4">
              <div className="space-y-2">
                <Label>Paste profile text</Label>
                <Textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste LinkedIn profile text, bio, or resume content here..."
                  rows={6}
                />
              </div>
            </TabsContent>
          </Tabs>

          <Button
            onClick={handleAnalyze}
            disabled={loading}
            className="mt-4 gradient-primary gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Analyze
          </Button>
        </CardContent>
      </Card>

      {/* Loading Skeleton */}
      {loading && !result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass border-border/50">
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
          <Card className="glass border-border/50">
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProfileAnalysisCard analysis={result.analysis} />
          <MessageTabs messages={result.messages} onGenerateVariant={handleVariant} loading={loading} />
        </div>
      )}
    </div>
  );
}
