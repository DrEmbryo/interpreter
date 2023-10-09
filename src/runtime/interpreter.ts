import { RuntimeValue, NumberValue } from "./values";

import {
  Statement,
  NumericLiteral,
  BinaryExpression,
  Program,
  Identifier,
  VariableDeclaration,
  AssignmentExpression,
  ObjectLiteral,
  CallExpression,
  FunctionDeclaration,
} from "../grammar/ast/astNodeTypes";

import Environment from "./environment";

import {
  evaluate_program,
  evaluate_variable_declaration,
  evaluate_function_declaration,
} from "./eval/statements";

import {
  evaluate_identifier,
  evaluate_binary_expression,
  evaluate_assignment,
  evaluate_object_expression,
  evaluate_call_expression,
} from "./eval/expressions";

export function evaluate(node: Statement, env: Environment): RuntimeValue {
  switch (node.kind) {
    case "NumericLiteral":
      return {
        value: (node as NumericLiteral).value,
        type: "number",
      } as NumberValue;

    case "Identifier":
      return evaluate_identifier(node as Identifier, env);

    case "ObjectLiteral":
      return evaluate_object_expression(node as ObjectLiteral, env);

    case "CallExpression":
      return evaluate_call_expression(node as CallExpression, env);

    case "AssignmentExpression":
      return evaluate_assignment(node as AssignmentExpression, env);

    case "BinaryExpression":
      return evaluate_binary_expression(node as BinaryExpression, env);

    case "VariableDeclaration":
      return evaluate_variable_declaration(node as VariableDeclaration, env);

    case "FunctionDeclaration":
      return evaluate_function_declaration(node as FunctionDeclaration, env);

    case "Program":
      return evaluate_program(node as Program, env);
    default:
      console.error("Unhandled AST node found during interpretation.", node);
      process.exit();
  }
}
