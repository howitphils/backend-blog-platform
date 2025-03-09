import { Router } from "express";
import { setDb } from "../db/memory/db";

export const testsRouter = Router();

testsRouter.delete("/all-data", (req, res) => {
  setDb();
  res.sendStatus(204);
});
