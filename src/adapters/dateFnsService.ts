import { add } from "date-fns";

export const dateFnsService = {
  addToCurrentDate() {
    return add(new Date(), {
      hours: 2,
      minutes: 22,
    });
  },
};
