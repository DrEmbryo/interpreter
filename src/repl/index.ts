import { input } from "@inquirer/prompts";
import Parser from "../Parser";
import Environment from "../runtime/environment";
import { evaluate } from "../runtime/interpreter";
import { NumberValue } from "../runtime/values";

repl();

async function repl() {
  const parser = new Parser();
  const env = new Environment();
  env.declare_variable("x", { value: 100, type: "number" } as NumberValue);
  console.log("\nrepl v0.01");
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
