import * as dotenv from "dotenv";
dotenv.config();

export const billingPlan = [
  {
    id: process.env.HOBBY_PLAN_ID,
    title: "Hobby",
    description: "Start your side project.",
    limit: 5,
    price: 0,
    advantages: ["Able to create 5 stores.", "Unlimited products."],
  },
  {
    id: process.env.PRO_PLAN_ID,
    title: "Pro",
    description: "Everything in hobby plus higher limits.",
    limit: 15,
    price: 20,
    advantages: ["Able to create 15 stores.", "Unlimited products."],
  },
  {
    id: process.env.ENTERPRISE_PLAN_ID,
    title: "Enterprise",
    description:
      "Everything in pro, suits for those who want to become a monopoly practicioner.",
    limit: 50,
    price: 100,
    advantages: ["Able to create 50 stores.", "Unlimited products."],
  },
];
