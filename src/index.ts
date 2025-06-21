import { app } from "./app";
import { runDb } from "./db/mongodb/mongodb";
import { APP_CONFIG } from "./settings";

const startApp = async () => {
  await runDb(APP_CONFIG.MONGO_URL, APP_CONFIG.DB_NAME);
  app.listen(APP_CONFIG.PORT, () => {
    console.log(`Listening on port: ${APP_CONFIG.PORT}`);
  });
};

startApp();
