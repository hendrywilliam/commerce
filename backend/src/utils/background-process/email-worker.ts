import { Worker, type Job } from "bullmq";
import { EMAIL_QUEUE } from "./queue";
import { log } from "../logger";
import { emailSender } from "../resend";
import "dotenv/config";

export const emailWorker = new Worker(
	EMAIL_QUEUE,
	async (job: Job) => {
		const userEmail = job.data.email;
		const emailResponse = await emailSender.emails.send({
			from: `commerce <onboarding@${process.env.MARKETING_DOMAIN}>`,
			to: [userEmail],
			subject: "Welcome to commerce!",
			html: "<p>It works</p>",
		});
		return emailResponse;
	},
	{
		autorun: false,
		connection: {
			host: "localhost",
			port: 6379,
		},
	},
);

emailWorker.on("completed", (job: Job, result) => {
	const { data, name } = job;
	console.log("received data: ", data);
	log.info(`Job: ${name} ended.`);
});
