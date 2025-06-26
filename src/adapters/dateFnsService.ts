import { add, subSeconds } from "date-fns";

class DateFnsService {
  addToCurrentDate(hours?: number, minutes?: number) {
    return add(new Date(), {
      hours: hours || 2,
      minutes: minutes || 22,
    });
  }

  rollBackBySeconds(seconds: number) {
    return subSeconds(new Date(), seconds);
  }
}

export const dateFnsService = new DateFnsService();
