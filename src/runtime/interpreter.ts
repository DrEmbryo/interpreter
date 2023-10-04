import { ValueType, RuntimeValue, NumberValue, NullValue } from "./values";
import {
  Statement,
  AstNodeType,
  NumericLiteral,
  BinaryExpression,
  Program,
} from "../ast/astNodeTypes";

function evaluate_program(program: Program): RuntimeValue {
  let last_evaluated: RuntimeValue = {
    value: "null",
    type: "null",
  } as NullValue;

  for (const statement of program.body) {
    last_evaluated = evaluate(statement);
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

function evaluate_binary_expression(binop: BinaryExpression): RuntimeValue {
  const leftSide = evaluate(binop.left);
  const rightSide = evaluate(binop.right);

  if (leftSide.type === "number" && rightSide.type === "number") {
    return evaluate_numeric_binary_expression(
      leftSide as NumberValue,
      rightSide as NumberValue,
      binop.operator
    );
  }

  return { type: "null", value: "null" } as NullValue;
}

export function evaluate(node: Statement): RuntimeValue {
  switch (node.kind) {
    case "NumericLiteral":
      return {
        value: (node as NumericLiteral).value,
        type: "number",
      } as NumberValue;

    case "NullLiteral":
      return { value: "null", type: "null" } as NullValue;

    case "BinaryExpression":
      return evaluate_binary_expression(node as BinaryExpression);

    case "Program":
      return evaluate_program(node as Program);
    default:
      console.error("Unhandled AST node found during interpretation.", node);
      process.exit();
  }
}
