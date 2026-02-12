import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Wifi, WifiOff, Save, Loader2 } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { checkHealth } from "@/api/client";

export default function Settings() {
  const { settings, saveSettings } = useSettings();
  const [apiUrl, setApiUrl] = useState(settings.apiUrl);
  const [offering, setOffering] = useState(settings.offering);
  const [testing, setTesting] = useState(false);

  const handleSave = () => {
    saveSettings({ apiUrl, offering });
    toast.success("Settings saved!");
  };

  const handleTestConnection = async () => {
    setTesting(true);
    try {
      // Temporarily save so the client uses the new URL
      localStorage.setItem("outreachai_settings", JSON.stringify({ apiUrl, offering }));
      const res = await checkHealth();
      if (res.data.status === "ok") {
        toast.success("Connected to backend successfully!");
      } else {
        toast.error("Unexpected response from backend");
      }
    } catch {
      toast.error("Could not connect to backend. Check the URL.");
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>Backend Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiUrl">Backend API URL</Label>
            <Input
              id="apiUrl"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="http://localhost:8000"
            />
          </div>
          <Button
            onClick={handleTestConnection}
            variant="outline"
            disabled={testing}
            className="gap-2"
          >
            {testing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Wifi className="w-4 h-4" />
            )}
            Test Connection
          </Button>
        </CardContent>
      </Card>

      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>Your Offering</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="offering">
              Describe what you sell or offer
            </Label>
            <Textarea
              id="offering"
              value={offering}
              onChange={(e) => setOffering(e.target.value)}
              placeholder='e.g., "We help companies scale engineering teams with vetted AI talent"'
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full gradient-primary gap-2">
        <Save className="w-4 h-4" />
        Save Settings
      </Button>
    </div>
  );
}
