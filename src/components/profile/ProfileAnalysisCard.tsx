import type { ProfileAnalysis } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Building2, Briefcase, GraduationCap, Award, Brain, MessageCircle, Lightbulb } from "lucide-react";

interface Props {
  analysis: ProfileAnalysis;
}

export function ProfileAnalysisCard({ analysis }: Props) {
  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Profile Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <InfoItem icon={User} label="Name" value={analysis.name} />
          <InfoItem icon={Building2} label="Company" value={analysis.company} />
          <InfoItem icon={Briefcase} label="Role" value={analysis.role} />
          <InfoItem label="Industry" value={analysis.industry} />
          <InfoItem label="Seniority" value={analysis.seniority} />
        </div>

        {analysis.education.length > 0 && (
          <Section icon={GraduationCap} title="Education">
            {analysis.education.map((e, i) => (
              <Badge key={i} variant="secondary" className="mr-1 mb-1">{e}</Badge>
            ))}
          </Section>
        )}

        {analysis.certifications.length > 0 && (
          <Section icon={Award} title="Certifications">
            {analysis.certifications.map((c, i) => (
              <Badge key={i} variant="outline" className="mr-1 mb-1">{c}</Badge>
            ))}
          </Section>
        )}

        {analysis.key_insights.length > 0 && (
          <Section icon={Lightbulb} title="Key Insights">
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {analysis.key_insights.map((k, i) => <li key={i}>{k}</li>)}
            </ul>
          </Section>
        )}

        <Section icon={Brain} title="Psychological Profile">
          <div className="grid grid-cols-2 gap-2 text-muted-foreground">
            <span>Decision Authority: {analysis.psychological_profile.decision_authority}</span>
            <span>Comm. Preference: {analysis.psychological_profile.communication_preference}</span>
          </div>
          <div className="mt-1 text-muted-foreground">
            <span>Pain Points: {analysis.psychological_profile.pain_points.join(", ")}</span>
          </div>
          <div className="text-muted-foreground">
            <span>Goals: {analysis.psychological_profile.goals.join(", ")}</span>
          </div>
        </Section>

        <Section icon={MessageCircle} title="Communication Style">
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary">{analysis.communication_style.formality}</Badge>
            <Badge variant="secondary">{analysis.communication_style.tone}</Badge>
            <Badge variant="secondary">{analysis.communication_style.vocabulary}</Badge>
          </div>
        </Section>
      </CardContent>
    </Card>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon?: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div>
      <span className="text-muted-foreground text-xs">{label}</span>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border/50 pt-3">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-primary" />
        <span className="font-medium text-xs uppercase tracking-wider">{title}</span>
      </div>
      {children}
    </div>
  );
}
