import { Resource } from "../components/ResourceCard";
import { initialResources } from "../data/mockData";

export const storage = {
  getResources: async (): Promise<Resource[]> => {
    try {
      const response = await fetch("/api/resources");
      
      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!response.ok || !contentType || !contentType.includes("application/json")) {
        throw new Error("API not available or returned non-JSON");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn("Falling back to local mock data:", error);
      // Fallback to initial data if API fails (e.g. local dev without DB)
      return initialResources;
    }
  },

  saveResource: async (resource: Resource): Promise<Resource[]> => {
    try {
      const response = await fetch("/api/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resource),
      });

      if (!response.ok) {
        throw new Error("Failed to save resource");
      }

      // After saving, re-fetch all resources to ensure consistency
      return await storage.getResources();
    } catch (error) {
      console.error("Failed to save resource:", error);
      return [];
    }
  },

  // For admin dashboard to delete or update (Placeholder for now)
  updateResources: async (resources: Resource[]) => {
    // Implementation would require a batch update API or individual updates
    console.log("Update not implemented for API storage yet");
  }
};
