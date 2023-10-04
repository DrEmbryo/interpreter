import { input } from "@inquirer/prompts";
import Parser from "../Parser";

repl();

async function repl() {
  console.log("\nrepl v0.01");
  while (true) {
    const answer = await input({ message: "> " });

    if (!answer || answer.includes("exit")) {
      process.exit();
    }

    const program = new Parser().generateAST(answer);

    console.log(program.body);
  }
}
