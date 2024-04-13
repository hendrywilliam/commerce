import { exec } from "node:child_process";

const command = process.argv[2];
console.log(process.argv);

if (!command) {
  console.error("Please provide commmand name.");
  process.exit(1);
}

const scriptPath = `./scripts/${command}.ts`;

exec(
  `tsx --stack-size=5120000 ${scriptPath}`,
  {
    maxBuffer: 1024 * 5000,
  },
  (error, stdout, stderr) => {
    if (error) {
      console.error(
        `Error executing script: ${error.message ?? "Something went wrong."}`,
      );
    }
    console.log(stdout);
    console.log(stderr);
  },
);
