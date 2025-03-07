import { agent } from "supertest";
import { app } from "../src/app";

export const req = agent(app);

export const credentials = Buffer.from("admin:qwerty").toString("base64");
