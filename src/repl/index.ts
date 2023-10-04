import { input } from "@inquirer/prompts";
import Parser from "../Parser";
import Environment from "../runtime/environment";
import { evaluate } from "../runtime/interpreter";
import { mk_number, mk_boolean, mk_null } from "../runtime/values";

repl();

async function repl() {
  const parser = new Parser();
  const env = new Environment();
  env.declare_variable("null", mk_null());
  env.declare_variable("true", mk_boolean(true));
  env.declare_variable("false", mk_boolean(false));
  env.declare_variable("x", mk_number(100));
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
