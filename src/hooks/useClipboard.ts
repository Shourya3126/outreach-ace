import { useCallback } from "react";
import { toast } from "sonner";

export function useClipboard() {
  const copy = useCallback(async (text: string, label?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label || "Text"} copied to clipboard!`, { duration: 2000 });
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  }, []);

  return { copy };
}
