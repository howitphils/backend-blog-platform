import { Router } from "express";
import { closeConnection, clearCollections } from "../db/mongodb/mongodb";

export const testsRouter = Router();

testsRouter.delete("/all-data", async (req, res) => {
  await clearCollections();
  await closeConnection();
  res.sendStatus(204);
});
