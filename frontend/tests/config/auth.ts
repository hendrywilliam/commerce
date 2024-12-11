import * as dotenv from "dotenv";
dotenv.config();

export const authentication = {
  email: process.env.TEST_EMAIL as string,
  pass: process.env.TEST_PASSWORD as string,
};
