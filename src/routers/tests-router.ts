import { Router } from "express";
import { setDb } from "../db/db";

export const testsRouter = Router();

testsRouter.delete("/all-data", (req, res) => {
  setDb();
  res.sendStatus(204);
});
