export type AstNodeType =
  | "Program"
  | "Identifier"
  | "BinaryExpression"
  | "NumericLiteral"
  | "NullLiteral";

export interface Statement {
  kind: AstNodeType;
}

export interface Program extends Statement {
  kind: "Program";
  body: Statement[];
}

export interface Expression extends Statement {
  kind: AstNodeType;
}

export interface BinaryExpression extends Expression {
  kind: "BinaryExpression";
  right: Expression;
  left: Expression;
  operator: string;
}

export interface Identifier extends Expression {
  kind: "Identifier";
  symbol: string;
}

export interface NumericLiteral extends Expression {
  kind: "NumericLiteral";
  value: number;
}

export interface NullLiteral extends Expression {
  kind: "NullLiteral";
  value: "null";
}
