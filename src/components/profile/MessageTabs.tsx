import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Copy, RefreshCw, Mail, Linkedin, MessageCircle, Smartphone, Instagram, Loader2 } from "lucide-react";
import { useClipboard } from "@/hooks/useClipboard";
import type { GeneratedMessages } from "@/types";

interface Props {
  messages: GeneratedMessages;
  onGenerateVariant: () => void;
  loading: boolean;
}

export function MessageTabs({ messages, onGenerateVariant, loading }: Props) {
  const { copy } = useClipboard();
  const [editedMessages, setEditedMessages] = useState(messages);

  const channels = [
    { key: "email" as const, label: "Email", icon: Mail },
    { key: "linkedin" as const, label: "LinkedIn", icon: Linkedin },
    { key: "whatsapp" as const, label: "WhatsApp", icon: MessageCircle },
    { key: "sms" as const, label: "SMS", icon: Smartphone },
    { key: "instagram" as const, label: "Instagram", icon: Instagram },
  ];

  return (
    <Card className="glass border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          Generated Messages
        </CardTitle>
        <Badge className="gradient-primary border-0">
          Score: {messages.analysis.personalization_score}
        </Badge>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="email">
          <TabsList className="w-full flex">
            {channels.map((ch) => (
              <TabsTrigger key={ch.key} value={ch.key} className="flex-1 gap-1 text-xs">
                <ch.icon className="w-3 h-3" />
                {ch.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="email" className="space-y-3 mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Subject</Label>
                <Button size="sm" variant="ghost" className="gap-1 h-7 text-xs" onClick={() => copy(editedMessages.email.subject, "Subject")}>
                  <Copy className="w-3 h-3" /> Copy
                </Button>
              </div>
              <Textarea
                value={editedMessages.email.subject}
                onChange={(e) => setEditedMessages({ ...editedMessages, email: { ...editedMessages.email, subject: e.target.value } })}
                rows={1}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Body</Label>
                <Button size="sm" variant="ghost" className="gap-1 h-7 text-xs" onClick={() => copy(editedMessages.email.body, "Email body")}>
                  <Copy className="w-3 h-3" /> Copy
                </Button>
              </div>
              <Textarea
                value={editedMessages.email.body}
                onChange={(e) => setEditedMessages({ ...editedMessages, email: { ...editedMessages.email, body: e.target.value } })}
                rows={6}
              />
            </div>
          </TabsContent>

          {channels.filter((c) => c.key !== "email").map((ch) => (
            <TabsContent key={ch.key} value={ch.key} className="space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <Label>{ch.label} Message</Label>
                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-1 h-7 text-xs"
                  onClick={() => copy(editedMessages[ch.key] as string, ch.label)}
                >
                  <Copy className="w-3 h-3" /> Copy
                </Button>
              </div>
              <Textarea
                value={editedMessages[ch.key] as string}
                onChange={(e) => setEditedMessages({ ...editedMessages, [ch.key]: e.target.value })}
                rows={6}
              />
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{messages.analysis.reasoning}</p>
          <Button size="sm" variant="outline" className="gap-1" onClick={onGenerateVariant} disabled={loading}>
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
            A/B Variant
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
