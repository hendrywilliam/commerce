"use server";

import { exec } from "node:child_process";

const command = process.argv[2];
const tails = process.argv.slice(3).join(" ");

if (!command) {
  console.error("Please provide commmand name.");
  process.exit(1);
}

const scriptPath = `./scripts/${command}.ts`;

/**
 * pnpm run script <script-file-name> <tails>
 *
 * Example usage:
 * pnpm run script create-new-store --id=100 --name=LofiGirl
 */
exec(
  `tsx --stack-size=5120000 ${scriptPath} ${tails}`,
  {
    maxBuffer: 1024 * 5000,
  },
  (error, stdout, stderr) => {
    if (error) {
      console.error(
        `Error executing script: ${error.message ?? "Something went wrong."}`
      );
    }
    console.log(stdout);
    console.log(stderr);
  }
);
