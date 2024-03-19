# Commerce

https://commerce.hendryw.com/

Work In Progress / Preview Mode — A fictional marketplace built with everything new in Next.js 14 (App Router), which allows users to purchase products, sign up and list their own product for sale. Users can create their own stores and collect payments for every transaction.

Key features:

- [x] Nextjs App Router with React Server Component
- [x] Intercepted routes for quick view.
- [x] Server Actions for mutation.
- [x] MySQL Database and Drizzle ORM.
- [x] Uploadthing for easy and type safety image uploader.
- [x] User authentication using Clerk.
- [x] Payment integration using Stripe.
- [x] Email system using React-Email and Resend.
- [x] Scheduled task using Qstash.

More feature will be added soon.

# Setup
* Create a new database in any serverless Postgre hosting (For serverfull environment please refer to your hosting documentation).
* Add `connectionString` to `DATABASE_URL` in env.
* Run `db:generate` to create a brand new migration.
* Run `db:push` to push a schema based prototype directly to the server. 

# Demo

To demo checkout experience, checkout with test card, such as `4242 4242 4242 4242` and use any future date for the expiry date e.g. `08/70` and random 3 digits for CVC. You will only able to checkout with products from sellers that have a Stripe account connected to their stores.
