import {
  AssignmentExpression,
  BinaryExpression,
  Identifier,
} from "../../grammar/ast/astNodeTypes";
import Environment from "../environment";
import { evaluate } from "../interpreter";
import { NumberValue, RuntimeValue, mk_null } from "../values";

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

export function evaluate_binary_expression(
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

export function evaluate_identifier(
  node: Identifier,
  env: Environment
): RuntimeValue {
  const value = env.get_variable_value(node.symbol);
  return value;
}

export function evaluate_assignment(
  node: AssignmentExpression,
  env: Environment
): RuntimeValue {
  if (node.assigne.kind !== "Identifier") {
    throw `Invalid left hand side of assignment expression ${JSON.stringify(
      node.assigne
    )}`;
  }

  const variable = (node.assigne as Identifier).symbol;
  return env.assign_variable(variable, evaluate(node.value, env));
}
