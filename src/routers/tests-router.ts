import { Router } from "express";
// import { db } from "../db/mongodb/mongo";
// import { SETTINGS } from "../settings";
import { clearCollections } from "../db/mongodb/mongodb";

export const testsRouter = Router();

testsRouter.delete("/all-data", async (req, res) => {
  await clearCollections();
  res.sendStatus(204);
});
