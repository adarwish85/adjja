
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Coach } from "@/types/coach";
import { coachService } from "@/services/coachService";
import { useCoachesRealTimeSync } from "./useCoachRealTimeSync";

export const useCoachesData = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCoaches = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("useCoachesData: Starting fetchCoaches...");
      
      const data = await coachService.fetchCoaches();
      console.log("useCoachesData: Fetched coaches successfully:", data.length);
      
      setCoaches(data);
      
      // Only show success message if we actually have coaches
      if (data.length === 0) {
        console.log("useCoachesData: No coaches found - this is normal if none have been added yet");
      }
    } catch (error) {
      console.error("useCoachesData: Error fetching coaches:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch coaches";
      setError(errorMessage);
      
      // Show specific error messages based on the error
      if (errorMessage.includes("Coach role does not exist")) {
        toast.error("Coach role not found in database. Please contact administrator.");
      } else if (errorMessage.includes("auth")) {
        toast.error("Authentication error while fetching coaches. Please try refreshing the page.");
      } else {
        toast.error("Unable to load coaches. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Enhanced real-time sync with better callbacks
  useCoachesRealTimeSync({
    onCoachAdded: () => {
      console.log("useCoachesData: Real-time: Traditional coach added, refreshing...");
      fetchCoaches();
    },
    onCoachUpdated: () => {
      console.log("useCoachesData: Real-time: Traditional coach updated, refreshing...");
      fetchCoaches();
    },
    onCoachRemoved: () => {
      console.log("useCoachesData: Real-time: Traditional coach removed, refreshing...");
      fetchCoaches();
    },
    onStudentUpgraded: () => {
      console.log("useCoachesData: Real-time: Student upgraded to coach or role changed, refreshing...");
      // Add a small delay to ensure database consistency
      setTimeout(() => {
        fetchCoaches();
      }, 500);
    },
  });

  useEffect(() => {
    fetchCoaches();
  }, []);

  return {
    coaches,
    loading,
    error,
    fetchCoaches,
    setCoaches,
  };
};
