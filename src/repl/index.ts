import { input } from "@inquirer/prompts";
import Parser from "../Parser";
import { evaluate } from "../runtime/interpreter";

repl();

async function repl() {
  console.log("\nrepl v0.01");
  while (true) {
    const answer = await input({ message: "> " });

    if (!answer || answer.includes("exit")) {
      process.exit();
    }

    const program = new Parser().generateAST(answer);
    const result = evaluate(program);
    console.log(result);
  }
}
