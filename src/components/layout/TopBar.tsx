import { useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/profile": "Single Profile",
  "/batch": "Batch Processing",
  "/knowledge": "Knowledge Base",
  "/settings": "Settings",
};

export function TopBar() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "OutreachAI";

  return (
    <header className="h-16 border-b border-border/50 glass flex items-center px-6 shrink-0">
      <div>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        <p className="text-xs text-muted-foreground">
          OutreachAI / {title}
        </p>
      </div>
    </header>
  );
}
