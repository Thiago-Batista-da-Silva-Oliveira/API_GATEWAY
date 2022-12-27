import express from "express";
import logger from "morgan";
import helmet from "helmet";
import { services } from "../config";
import cors from "cors";
import * as dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";
import { ensureAuthenticated } from "./authMiddleware";

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

app.use(cors({ origin: "*" }));
app.use(logger("dev"));
app.use(helmet());
app.get("/", (req, res) => {
  return res.json({ message: "Running application" });
});

app.use(
  "/session",
  createProxyMiddleware({
    target: process.env.AUTH_PATH,
    changeOrigin: true,
    pathRewrite: {
      "^/session/": "/",
    },
  })
);

services.forEach(({ name, url }) => {
  const rewriteFn = function (path) {
    return path.replace(`${name}`, "/");
  };

  const options = {
    target: url,
    changeOrigin: true,
    pathRewrite: rewriteFn,
  };
  app.use(`/${name}`, ensureAuthenticated, createProxyMiddleware(options));
});

app.listen(3332, () => console.log("server is running"));
