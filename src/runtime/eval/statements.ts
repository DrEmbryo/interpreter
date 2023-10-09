import {
  FunctionDeclaration,
  Program,
  VariableDeclaration,
} from "../../grammar/ast/astNodeTypes";
import Environment from "../environment";
import { evaluate } from "../interpreter";
import { FunctionValue, RuntimeValue, mk_null } from "../values";

export function evaluate_program(
  program: Program,
  env: Environment
): RuntimeValue {
  let last_evaluated: RuntimeValue = mk_null();

  for (const statement of program.body) {
    last_evaluated = evaluate(statement, env);
  }

  return last_evaluated;
}

export function evaluate_variable_declaration(
  node: VariableDeclaration,
  env: Environment
): RuntimeValue {
  const value = node.value ? evaluate(node.value, env) : mk_null();
  return env.declare_variable(node.identifier, value, node.constant);
}

export function evaluate_function_declaration(
  node: FunctionDeclaration,
  env: Environment
): RuntimeValue {
  const func = {
    type: "function",
    name: node.name,
    parameters: node.parameters,
    env,
    body: node.body,
  } as FunctionValue;

  return env.declare_variable(node.name, func, true);
}
