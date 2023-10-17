import {
  AssignmentExpression,
  BinaryExpression,
  CallExpression,
  Identifier,
  ObjectLiteral,
} from "../../grammar/ast/astNodeTypes";
import Environment from "../environment";
import { evaluate } from "../interpreter";
import {
  BooleanValue,
  FunctionValue,
  NativeFunctionValue,
  NumberValue,
  ObjectValue,
  RuntimeValue,
  mk_null,
} from "../values";

function evaluate_numeric_binary_expression(
  leftSide: NumberValue,
  rightSide: NumberValue,
  operator: string
): NumberValue {
  let result: number;

  switch (operator) {
    case "+":
      result = leftSide.value + rightSide.value;
      break;
    case "-":
      result = leftSide.value - rightSide.value;
      break;
    case "*":
      result = leftSide.value * rightSide.value;
      break;
    case "/":
      if (rightSide.value !== 0) result = leftSide.value / rightSide.value;
      else result = Infinity;
      break;
    case "%":
      if (rightSide.value !== 0) result = leftSide.value % rightSide.value;
      else result = Infinity;
      break;
    default:
      result = 0;
      break;
  }

  return { type: "number", value: result } as NumberValue;
}

function evaluate_logic_binary_expression(
  leftSide: NumberValue,
  rightSide: NumberValue,
  operator: string
): BooleanValue {
  let result: boolean;

  switch (operator) {
    case ">":
      result = leftSide.value > rightSide.value;
      break;
    case "<":
      result = leftSide.value < rightSide.value;
      break;
    default:
      result = false;
      break;
  }

  return { type: "boolean", value: result } as BooleanValue;
}

export function evaluate_binary_expression(
  binop: BinaryExpression,
  env: Environment
): RuntimeValue {
  const leftSide = evaluate(binop.left, env);
  const rightSide = evaluate(binop.right, env);

  if (leftSide.type === "number" && rightSide.type === "number") {
    if (binop.operator === "<" || binop.operator === ">")
      return evaluate_logic_binary_expression(
        leftSide as NumberValue,
        rightSide as NumberValue,
        binop.operator
      );
    else
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

export function evaluate_object_expression(
  node: ObjectLiteral,
  env: Environment
): RuntimeValue {
  const object = {
    type: "object",
    properties: new Map<string, RuntimeValue>(),
  } as ObjectValue;

  for (const { key, value } of node.properties) {
    const runtime_value =
      value === undefined ? env.get_variable_value(key) : evaluate(value, env);

    object.properties.set(key, runtime_value);
  }

  return object;
}

export function evaluate_call_expression(
  expression: CallExpression,
  env: Environment
): RuntimeValue {
  const args = expression.args.map((arg) => evaluate(arg, env));
  const fn = evaluate(expression.caller, env);

  if (fn.type === "native_function") {
    const res = (fn as NativeFunctionValue).call(args, env);
    return res;
  }

  if (fn.type === "function") {
    const func = fn as FunctionValue;
    const scope = new Environment(func.env);

    for (let i = 0; i < func.parameters.length; i++) {
      if (func.parameters.length !== args.length)
        throw `Function ${func.name} call miss-match arguments. Expected ${func.parameters.length} args, received ${args.length}`;
      scope.declare_variable(func.parameters[i], args[i], false);
    }

    let res: RuntimeValue = mk_null();
    for (const statement of func.body) {
      res = evaluate(statement, scope);
    }

    return res;
  }

  throw "Can't call value that is not a function";
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
