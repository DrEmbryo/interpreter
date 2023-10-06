export type ValueType = "null" | "number" | "boolean" | "object";

export interface RuntimeValue {
  type: ValueType;
}

export interface NullValue extends RuntimeValue {
  type: "null";
  value: null;
}

export function mk_null() {
  return { type: "null", value: null } as NullValue;
}

export interface BooleanValue extends RuntimeValue {
  type: "boolean";
  value: boolean;
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

export interface ObjectValue extends RuntimeValue {
  type: "object";
  properties: Map<string, RuntimeValue>;
}
