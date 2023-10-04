import { RuntimeValue, NumberValue, mk_null } from "./values";
import {
  Statement,
  AstNodeType,
  NumericLiteral,
  BinaryExpression,
  Program,
  Identifier,
} from "../ast/astNodeTypes";
import Environment from "./environment";

function evaluate_program(program: Program, env: Environment): RuntimeValue {
  let last_evaluated: RuntimeValue = mk_null();

  for (const statement of program.body) {
    last_evaluated = evaluate(statement, env);
  }

  return last_evaluated;
}

function evaluate_numeric_binary_expression(
  leftSide: NumberValue,
  rightSide: NumberValue,
  operator: string
): NumberValue {
  let result: number;

  switch (operator) {
    case "+":
      result = rightSide.value + leftSide.value;
      break;
    case "-":
      result = rightSide.value - leftSide.value;
      break;
    case "*":
      result = rightSide.value * leftSide.value;
      break;
    case "/":
      // TODO: division by zero case
      result = rightSide.value / leftSide.value;
      break;
    case "%":
      result = rightSide.value % leftSide.value;
      break;
    default:
      result = 0;
      break;
  }

  return { type: "number", value: result } as NumberValue;
}

function evaluate_binary_expression(
  binop: BinaryExpression,
  env: Environment
): RuntimeValue {
  const leftSide = evaluate(binop.left, env);
  const rightSide = evaluate(binop.right, env);

  if (leftSide.type === "number" && rightSide.type === "number") {
    return evaluate_numeric_binary_expression(
      leftSide as NumberValue,
      rightSide as NumberValue,
      binop.operator
    );
  }

  return mk_null();
}

function evaluate_identifier(node: Identifier, env: Environment): RuntimeValue {
  const value = env.get_variable_value(node.symbol);
  return value;
}

export function evaluate(node: Statement, env: Environment): RuntimeValue {
  switch (node.kind) {
    case "NumericLiteral":
      return {
        value: (node as NumericLiteral).value,
        type: "number",
      } as NumberValue;

    case "Identifier":
      return evaluate_identifier(node as Identifier, env);

    case "BinaryExpression":
      return evaluate_binary_expression(node as BinaryExpression, env);

    case "Program":
      return evaluate_program(node as Program, env);
    default:
      console.error("Unhandled AST node found during interpretation.", node);
      process.exit();
  }
}
