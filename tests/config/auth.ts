import * as dotenv from "dotenv";
dotenv.config();

export const authentication = {
  email: process.env.TEST_EMAIL,
  pass: process.env.TEST_PASSWORD,
};
