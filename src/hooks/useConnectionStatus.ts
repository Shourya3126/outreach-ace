import { useState, useEffect, useCallback } from "react";
import { checkHealth } from "@/api/client";

export function useConnectionStatus() {
  const [connected, setConnected] = useState(false);
  const [checking, setChecking] = useState(false);

  const check = useCallback(async () => {
    setChecking(true);
    try {
      const res = await checkHealth();
      setConnected(res.data.status === "ok");
    } catch {
      setConnected(false);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, [check]);

  return { connected, checking, check };
}
