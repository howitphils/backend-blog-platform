import { add, subHours, subSeconds } from "date-fns";

export const dateFnsService = {
  addToCurrentDate(hours?: number, minutes?: number) {
    return add(new Date(), {
      hours: hours || 2,
      minutes: minutes || 22,
    });
  },
  cutBackFromCurrentDate() {
    return subHours(new Date(), 2);
  },
  rollBackBySeconds(seconds: number) {
    return subSeconds(new Date(), seconds);
  },
};
