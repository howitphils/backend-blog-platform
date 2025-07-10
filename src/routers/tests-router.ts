import { Router } from "express";
import { clearCollections } from "../db/mongodb/mongodb";
import { HttpStatuses } from "../types/http-statuses";

export const testsRouter = Router();

testsRouter.delete("/all-data", async (req, res) => {
  await clearCollections();
  res.sendStatus(HttpStatuses.NoContent);
});
