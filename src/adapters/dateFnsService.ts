import { add, subSeconds } from "date-fns";

export const dateFnsService = {
  addToCurrentDate(hours?: number, minutes?: number) {
    return add(new Date(), {
      hours: hours || 2,
      minutes: minutes || 22,
    });
  },

  rollBackBySeconds(seconds: number) {
    return subSeconds(new Date(), seconds);
  },
};
