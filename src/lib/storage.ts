import { Resource } from "../components/ResourceCard";
import { initialResources } from "../data/mockData";

export const storage = {
  isMock: false,
  getResources: async (): Promise<Resource[]> => {
    try {
      const response = await fetch("/api/resources");
      
      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error((errorData as any).error || `服务器返回错误: ${response.status}`);
      }
      
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("API 返回格式不正确");
      }

      const data = await response.json() as Resource[];
      storage.isMock = false;
      return data;
    } catch (error) {
      console.error("Database fetch error:", error);
      storage.isMock = true;
      // Only fallback to mock if it's a network error or 404, not a 500 DB error
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
        const errorData = await response.json().catch(() => ({})) as { error?: string };
        throw new Error(errorData.error || "Failed to save resource");
      }

      return await storage.getResources();
    } catch (error) {
      console.error("Failed to save resource:", error);
      // Return current resources instead of empty list to avoid clearing UI
      return await storage.getResources();
    }
  },

  updateResource: async (resource: Resource): Promise<Resource[]> => {
    try {
      const response = await fetch("/api/resources", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resource),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as { error?: string };
        throw new Error(errorData.error || "Failed to update resource");
      }

      return await storage.getResources();
    } catch (error) {
      console.error("Failed to update resource:", error);
      // Return current resources instead of empty list to avoid clearing UI
      return await storage.getResources();
    }
  },

  deleteResource: async (id: string): Promise<Resource[]> => {
    try {
      const response = await fetch(`/api/resources?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete resource");
      }

      return await storage.getResources();
    } catch (error) {
      console.error("Failed to delete resource:", error);
      return [];
    }
  },

  // For admin dashboard to delete or update (Placeholder for now)
  updateResources: async (resources: Resource[]) => {
    console.log("Update not implemented for API storage yet");
  },

  getStats: async (): Promise<{ visitor_count: number }> => {
    try {
      const response = await fetch("/api/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      return await response.json();
    } catch (error) {
      console.warn("Stats API not available:", error);
      return { visitor_count: 0 };
    }
  },

  trackVisit: async (): Promise<void> => {
    try {
      await fetch("/api/stats", { method: "POST" });
    } catch (error) {
      console.warn("Failed to track visit:", error);
    }
  }
};
