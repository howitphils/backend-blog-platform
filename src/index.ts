import { app } from "./app";
import { db } from "./db/mongodb/mongo";
import { SETTINGS } from "./settings";

const startApp = async () => {
  await db.run(SETTINGS.MONGO_URL);
  app.listen(SETTINGS.PORT, () => {
    console.log(`Listening on port: ${SETTINGS.PORT}`);
  });
};

startApp();
