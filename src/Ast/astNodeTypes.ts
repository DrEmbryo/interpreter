export type AstNodeType =
  //statements
  | "Program"
  | "VariableDeclaration"
  //expressions
  | "Identifier"
  | "NumericLiteral"
  | "BinaryExpression"
  | "AssignmentExpression";

export interface Statement {
  kind: AstNodeType;
}

export interface Expression extends Statement {
  kind: AstNodeType;
}

export interface Program extends Statement {
  kind: "Program";
  body: Statement[];
}

export interface VariableDeclaration extends Statement {
  kind: "VariableDeclaration";
  constant: boolean;
  identifier: string;
  value?: Expression;
}

export interface Identifier extends Expression {
  kind: "Identifier";
  symbol: string;
}

export interface NumericLiteral extends Expression {
  kind: "NumericLiteral";
  value: number;
}

export interface BinaryExpression extends Expression {
  kind: "BinaryExpression";
  right: Expression;
  left: Expression;
  operator: string;
}

export interface AssignmentExpression extends Expression {
  kind: "AssignmentExpression";
  assigne: Expression;
  value: Expression;
}
