import * as dotenv from "dotenv";
dotenv.config();

export const subscriptionPlans = [
  {
    id: process.env.HOBBY_PLAN_ID,
    title: "Hobby",
    description: "Suitables for individuals.",
    limit: 1,
    price: 0,
    advantages: ["Able to create 1 stores.", "Unlimited products."],
  },
  {
    id: process.env.PRO_PLAN_ID,
    title: "Pro",
    description: "Suitables for small business owners.",
    limit: 5,
    price: 20,
    advantages: ["Able to create 5 stores.", "Unlimited products."],
  },
  {
    id: process.env.ENTERPRISE_PLAN_ID,
    title: "Enterprise",
    description: "Suitables for big business owner.",
    limit: 10,
    price: 100,
    advantages: ["Able to create 10 stores.", "Unlimited products."],
  },
];
