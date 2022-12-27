import * as dotenv from "dotenv";
dotenv.config();

export const services = [
  {
    name: process.env.APP_NAME || "app",
    url: process.env.APP_URL || "http://localhost:3333",
  },
  {
    name: process.env.NOTIFICATION_NAME || "notifications",
    url: process.env.NOTIFICATION_URL || "http://localhost:3337",
  },
];
