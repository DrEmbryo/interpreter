import { promises as fsp } from "fs";
import * as path from "path";
import { input } from "@inquirer/prompts";
import { evaluate } from "../runtime/interpreter";
import { parser, env } from "./env";

main();

async function read_from_file(filename: string) {
  return fsp.readFile(path.resolve(__dirname, filename), "utf-8");
}

async function main() {
  const source = await read_from_file("test.txt");
  console.log("\nrepl v0.02");
  while (true) {
    // const answer = await input({ message: "> " });

    // if (!answer || answer.includes("exit")) {
    //   process.exit();
    // }

    const program = parser.generateAST(source);
    const result = evaluate(program, env);

    break;
  }
}
