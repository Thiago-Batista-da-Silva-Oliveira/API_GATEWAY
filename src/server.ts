import express from "express";
import logger from "morgan";
import helmet from "helmet";
import httpProxy from "express-http-proxy";
import { services } from "../config";
import * as dotenv from "dotenv";
dotenv.config();

/*
import { resolve } from "path";
import { readFileSync } from "fs";
import { load } from "js-yaml";
const pathFile = resolve(process.cwd(), "config.yml");
const readConfig = readFileSync(pathFile, { encoding: "utf-8" });
const { services } = load(readConfig, { json: true });

*/

const app = express();

app.use(logger("dev"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.json({ message: "Running application" });
});

services.forEach(({ name, url }) => {
  app.use(`/${name}`, httpProxy(url, { timeout: 3000 }));
});

app.listen(3332, () => console.log("server is running"));
