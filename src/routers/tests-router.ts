import { Router } from "express";
import { closeConnection, dropCollecitions } from "../db/mongodb/mongodb";

export const testsRouter = Router();

testsRouter.delete("/all-data", async (req, res) => {
  await dropCollecitions();
  await closeConnection();
  res.sendStatus(204);
});
