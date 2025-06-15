
import { coachQueries } from "./coach/coachQueries";
import { coachMutations } from "./coach/coachMutations";
import { coachClassAssignments } from "./coach/coachClassAssignments";

export const coachService = {
  ...coachQueries,
  ...coachMutations,
  ...coachClassAssignments
};
