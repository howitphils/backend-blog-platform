import { app } from "./app";
import { connectToDB } from "./db/mongodb/mongodb";
import { SETTINGS } from "./settings";

const startApp = async () => {
  await connectToDB();
  app.listen(SETTINGS.PORT, () => {
    console.log(`Listening on port: ${SETTINGS.PORT}`);
  });
};

startApp();
