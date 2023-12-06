import * as dotenv from "dotenv";
dotenv.config();

export const environmentVariables = {
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
};
