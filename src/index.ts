import { app } from "./app";
import { SETTINGS } from "./settings";

app.listen(SETTINGS.PORT, () => {
  console.log(`Listening on port: ${SETTINGS.PORT}`);
});
