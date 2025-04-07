import { app } from "./app";
import { runDb } from "./db/mongodb/mongodb";
import { SETTINGS } from "./settings";

const startApp = async () => {
  await runDb(SETTINGS.MONGO_URL, SETTINGS.DB_NAME);
  app.listen(SETTINGS.PORT, () => {
    console.log(`Listening on port: ${SETTINGS.PORT}`);
  });
};

startApp();
