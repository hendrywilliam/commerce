import { Queue } from "bullmq";

export const EMAIL_QUEUE = "email_queue";

export const emailQueue = new Queue(EMAIL_QUEUE, {
	connection: {
		host: "localhost",
		port: 6379,
	},
	defaultJobOptions: {
		// global setting for each jobs.
		attempts: 3,
		backoff: {
			type: "exponential",
			delay: 1000,
		},
	},
});
