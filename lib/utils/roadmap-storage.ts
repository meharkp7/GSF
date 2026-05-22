/**
 * Local storage utilities for roadmap persistence
 * Handles safe hydration and data preservation across page reloads
 */

import type { RoadmapConfig } from "@/lib/types/roadmap";

const STORAGE_KEY = "gsf_roadmap_config";

/**
 * Save roadmap configuration to localStorage
 */
export function saveRoadmapConfig(config: RoadmapConfig): void {
  try {
    const serialized = JSON.stringify(config);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error("Failed to save roadmap config:", error);
  }
}

/**
 * Load roadmap configuration from localStorage
 */
export function loadRoadmapConfig(): RoadmapConfig | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;
    
    const config = JSON.parse(serialized) as RoadmapConfig;
    return config;
  } catch (error) {
    console.error("Failed to load roadmap config:", error);
    return null;
  }
}

/**
 * Clear roadmap configuration from localStorage
 */
export function clearRoadmapConfig(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear roadmap config:", error);
  }
}

/**
 * Export roadmap configuration as JSON file
 */
export function exportRoadmapConfig(config: RoadmapConfig): void {
  try {
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `roadmap-${config.ventureName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to export roadmap config:", error);
  }
}

/**
 * Import roadmap configuration from JSON file
 */
export function importRoadmapConfig(file: File): Promise<RoadmapConfig> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const config = JSON.parse(content) as RoadmapConfig;
        resolve(config);
      } catch (error) {
        reject(new Error("Invalid roadmap configuration file"));
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    
    reader.readAsText(file);
  });
}
