import { agent } from "supertest";
import { app } from "../src/app";
import { SETTINGS } from "../src/settings";

export const req = agent(app);

export const credentials = Buffer.from(SETTINGS.ADMIN).toString("base64");
