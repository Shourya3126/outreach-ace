import { useState, useCallback } from "react";
import type { AppSettings } from "@/types";

const STORAGE_KEY = "outreachai_settings";

const defaultSettings: AppSettings = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:8000",
  offering: "",
};

function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaultSettings, ...JSON.parse(stored) };
  } catch {}
  return defaultSettings;
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);

  const saveSettings = useCallback((newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
  }, []);

  return { settings, saveSettings };
}

export function getSettings(): AppSettings {
  return loadSettings();
}
