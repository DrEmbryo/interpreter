import { input } from "@inquirer/prompts";
import { evaluate } from "../runtime/interpreter";
import { parser, env } from "./env";

main();

async function main() {
  console.log("\nrepl v0.02");
  while (true) {
    const answer = await input({ message: "> " });

    if (!answer || answer.includes("exit")) {
      process.exit();
    }

    const program = parser.generateAST(answer);
    const result = evaluate(program, env);
    console.log(result);
  }
}
