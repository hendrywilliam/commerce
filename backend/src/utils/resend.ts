import "dotenv/config";
import { Resend } from "resend";

export const emailSender = new Resend(process.env.RESEND_API_KEY);
