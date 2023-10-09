import { Statement } from "../grammar/ast/astNodeTypes";
import Environment from "./environment";

export type ValueType =
  | "null"
  | "number"
  | "string"
  | "boolean"
  | "object"
  | "function"
  | "native_function";

export interface RuntimeValue {
  type: ValueType;
}

export interface NullValue extends RuntimeValue {
  type: "null";
  value: null;
}

export interface BooleanValue extends RuntimeValue {
  type: "boolean";
  value: boolean;
}

export interface StringValue extends RuntimeValue {
  type: "string";
  value: string;
}

export interface ObjectValue extends RuntimeValue {
  type: "object";
  properties: Map<string, RuntimeValue>;
}

export type NativeFunctionCall = (
  args: RuntimeValue[],
  env: Environment
) => RuntimeValue;

export interface NativeFunctionValue extends RuntimeValue {
  type: "native_function";
  call: NativeFunctionCall;
}

export interface FunctionValue extends RuntimeValue {
  type: "function";
  name: string;
  parameters: string[];
  env: Environment;
  body: Statement[];
}

export function mk_boolean(value = true) {
  return { type: "boolean", value: value } as BooleanValue;
}

export interface NumberValue extends RuntimeValue {
  type: "number";
  value: number;
}

export function mk_number(value: number) {
  return { type: "number", value: value } as NumberValue;
}

export function mk_string(value: string) {
  return { type: "string", value: value } as StringValue;
}

export function mk_null() {
  return { type: "null", value: null } as NullValue;
}

export function mk_native_function(call: NativeFunctionCall) {
  return { type: "native_function", call } as NativeFunctionValue;
}
