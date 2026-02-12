import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Users,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";

const navItems = [
  { title: "Dashboard", path: "/", icon: LayoutDashboard },
  { title: "Single Profile", path: "/profile", icon: User },
  { title: "Batch Processing", path: "/batch", icon: Users },
  { title: "Knowledge Base", path: "/knowledge", icon: BookOpen },
  { title: "Settings", path: "/settings", icon: Settings },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { connected } = useConnectionStatus();

  return (
    <aside
      className={cn(
        "flex flex-col h-screen glass-strong border-r border-border/50 transition-all duration-300 shrink-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border/50">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="text-lg font-bold gradient-text">OutreachAI</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/15 text-primary glow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: connection status + collapse */}
      <div className="p-3 border-t border-border/50 space-y-2">
        <div className="flex items-center gap-2 px-2">
          <div
            className={cn(
              "w-2.5 h-2.5 rounded-full shrink-0",
              connected ? "bg-[hsl(var(--success))]" : "bg-destructive"
            )}
          />
          {!collapsed && (
            <span className="text-xs text-muted-foreground">
              {connected ? "API Connected" : "Disconnected"}
            </span>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
