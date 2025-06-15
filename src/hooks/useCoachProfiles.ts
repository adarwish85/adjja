
import { useCoachProfileData } from "./coach-profiles/useCoachProfileData";
import { useCoachProfileMutations } from "./coach-profiles/useCoachProfileMutations";

export const useCoachProfiles = () => {
  const { getCoachProfile } = useCoachProfileData();
  const { saveCoachProfile, loading } = useCoachProfileMutations();

  return {
    getCoachProfile,
    saveCoachProfile,
    loading
  };
};
