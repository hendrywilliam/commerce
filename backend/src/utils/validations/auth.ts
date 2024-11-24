import z from "zod";

export const validation_registerUser = z
	.object({
		username: z.string({ required_error: "Username is required." }).min(1),
		email: z
			.string({
				required_error: "Email is required.",
			})
			.email({
				message: "Invalid email. Please provide a proper email.",
			}),
		password: z
			.string({
				required_error: "Password is required.",
			})
			.regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
				message:
					"Password must contains atleast eight characters, and atleast one letter and one number.",
			}),
		confirmPassword: z.string({
			required_error: "Confirm Password is required.",
		}),
		fullName: z.string({ required_error: "Full name is required." }).min(1),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Password does not match with confirm password.",
		path: ["confirmPassword"],
	});
