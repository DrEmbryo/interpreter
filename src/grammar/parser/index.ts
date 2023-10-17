import {
  Statement,
  Expression,
  BinaryExpression,
  Identifier,
  NumericLiteral,
  Program,
  VariableDeclaration,
  AssignmentExpression,
  Property,
  ObjectLiteral,
  CallExpression,
  MemberExpression,
  FunctionDeclaration,
  StringLiteral,
} from "../ast/astNodeTypes";

import { Token, TokenType } from "../lexer/rules";
import { tokenize } from "../lexer";

export default class Parser {
  private tokens: Token[] = [];

  private is_eof() {
    return this.tokens[0].type === TokenType.EOF;
  }

  private token_at(): Token {
    return this.tokens[0];
  }

  private next_token(): Token {
    return this.tokens.shift() as Token;
  }

  private expected_next(type: TokenType, err: string): Token {
    const previous = this.tokens.shift() as Token;
    if (!previous || previous.type !== type) {
      console.error("Parsing Error: \n", err, previous, " expected:", type);
      process.exit();
    }
    return previous;
  }

  public generateAST(source: string): Program {
    this.tokens = tokenize(source);
    const program: Program = {
      kind: "Program",
      body: [],
    };

    while (!this.is_eof()) {
      program.body.push(this.parse_statement());
    }

    return program;
  }

  private parse_statement(): Statement {
    switch (this.token_at().type) {
      case TokenType.Let:
      case TokenType.Const:
        return this.parse_variable_declaration();
      case TokenType.Function:
        return this.parse_function_declaration();
    }
    return this.parse_expression();
  }

  private parse_function_declaration(): Statement {
    this.next_token();
    const name = this.expected_next(
      TokenType.Identifier,
      "Expected function name following function keyword"
    ).value;

    const args = this.parse_arguments();
    const parameters = args.map((arg) => {
      if (arg.kind !== "Identifier") {
        throw "Function declaration parameters expected to be of type string.";
      }
      return (arg as Identifier).symbol;
    });

    this.expected_next(TokenType.OpenCurlyBrace, "Expected function body");
    const body: Statement[] = [];

    while (
      this.token_at().type !== TokenType.EOF &&
      this.token_at().type != TokenType.CloseCurlyBrace
    ) {
      body.push(this.parse_statement());
    }
    this.expected_next(
      TokenType.CloseCurlyBrace,
      "Expected closing brace at the end of the function body"
    );

    const func = {
      kind: "FunctionDeclaration",
      name,
      parameters,
      body,
    } as FunctionDeclaration;

    return func;
  }

  private parse_variable_declaration(): Statement {
    const is_constant = this.next_token().type === TokenType.Const;
    const identifier = this.expected_next(
      TokenType.Identifier,
      "Expected identifier name after let/const keywords."
    ).value;

    if (this.token_at().type === TokenType.Semicolon) {
      this.next_token();
      if (is_constant) {
        throw "Constants expected to have values assigned. No value was provided.";
      }
      return {
        kind: "VariableDeclaration",
        identifier,
        constant: false,
        value: undefined,
      } as VariableDeclaration;
    }
    this.expected_next(
      TokenType.Equals,
      "Expected equals token after identifier in variable declaration."
    );

    const declaration = {
      kind: "VariableDeclaration",
      identifier,
      value: this.parse_expression(),
      constant: is_constant,
    } as VariableDeclaration;

    this.expected_next(
      TokenType.Semicolon,
      "Expected semicolon after the variable declaration"
    );

    return declaration;
  }

  private parse_expression(): Expression {
    return this.parse_assignment_expression();
  }

  private parse_assignment_expression(): Expression {
    const left = this.parse_object_expression();

    if (this.token_at().type === TokenType.Equals) {
      this.next_token();
      const value = this.parse_assignment_expression();
      return {
        kind: "AssignmentExpression",
        assigne: left,
        value,
      } as AssignmentExpression;
    }

    return left;
  }

  private parse_object_expression(): Expression {
    if (this.token_at().type !== TokenType.OpenCurlyBrace) {
      return this.parse_additive_expression();
    }

    this.next_token();
    const properties = new Array<Property>();

    while (
      !this.is_eof() &&
      this.token_at().type !== TokenType.CloseCurlyBrace
    ) {
      const key = this.expected_next(
        TokenType.Identifier,
        "Object literal key expected"
      ).value;

      if (this.token_at().type === TokenType.Coma) {
        this.next_token();
        properties.push({ kind: "Property", key } as Property);
        continue;
      } else if (this.token_at().type === TokenType.CloseCurlyBrace) {
        properties.push({ kind: "Property", key } as Property);
        continue;
      }

      this.expected_next(
        TokenType.Colon,
        "Expected colin after identifier in object expression"
      );

      const value = this.parse_expression();

      properties.push({ kind: "Property", key, value });
      if (this.token_at().type !== TokenType.CloseCurlyBrace) {
        this.expected_next(
          TokenType.Coma,
          "Expected coma or closing bracket after property"
        );
      }
    }

    this.expected_next(
      TokenType.CloseCurlyBrace,
      "Object literal missing closing brace"
    );
    return { kind: "ObjectLiteral", properties } as ObjectLiteral;
  }

  private parse_multiplicative_expression(): Expression {
    let left = this.parse_call_member_expression();

    while (
      this.token_at().value === "*" ||
      this.token_at().value === "/" ||
      this.token_at().value === "%"
    ) {
      const operator = this.next_token().value;
      const right = this.parse_call_member_expression();
      left = {
        kind: "BinaryExpression",
        left,
        right,
        operator,
      } as BinaryExpression;
    }

    return left;
  }

  private parse_call_member_expression(): Expression {
    const member = this.parse_member_expression();

    if (this.token_at().type === TokenType.OpenParen) {
      return this.parse_call_expression(member);
    }

    return member;
  }

  private parse_call_expression(caller: Expression): Expression {
    let call: Expression = {
      kind: "CallExpression",
      caller,
      args: this.parse_arguments(),
    } as CallExpression;

    if (this.token_at().type == TokenType.OpenParen) {
      call = this.parse_call_expression(call);
    }

    return call;
  }

  private parse_arguments(): Expression[] {
    this.expected_next(TokenType.OpenParen, "Expected open parentheses");
    const args =
      this.token_at().type == TokenType.CloseParen
        ? []
        : this.parse_arguments_list();
    this.expected_next(
      TokenType.CloseParen,
      "Missing closing parentheses inside argument list"
    );
    return args;
  }

  private parse_arguments_list(): Expression[] {
    const args = [this.parse_assignment_expression()];

    while (this.token_at().type === TokenType.Coma && this.next_token()) {
      args.push(this.parse_assignment_expression());
    }

    return args;
  }

  private parse_member_expression(): Expression {
    let object = this.parse_primary_expression();

    while (
      this.token_at().type === TokenType.Dot ||
      this.token_at().type === TokenType.OpenSquareBrace
    ) {
      const operator = this.next_token();
      let property: Expression;
      let computed: boolean;

      if (operator.type == TokenType.Dot) {
        computed = false;
        property = this.parse_primary_expression();

        if (property.kind !== "Identifier") {
          throw `Can't use . without right hand side being an identifier`;
        }
      } else {
        computed = true;
        property = this.parse_expression();
        this.expected_next(
          TokenType.CloseSquareBrace,
          "Missing closing square brace in computed value"
        );
      }

      object = {
        kind: "MemberExpression",
        object,
        property,
        computed,
      } as MemberExpression;
    }

    return object;
  }

  private parse_additive_expression(): Expression {
    let left = this.parse_multiplicative_expression();

    while (
      this.token_at().value === "+" ||
      this.token_at().value === "-" ||
      this.token_at().value === "<" ||
      this.token_at().value === ">"
    ) {
      const operator = this.next_token().value;
      const right = this.parse_multiplicative_expression();
      left = {
        kind: "BinaryExpression",
        left,
        right,
        operator,
      } as BinaryExpression;
    }

    return left;
  }

  private parse_primary_expression(): Expression {
    const current_token = this.token_at().type;
    switch (current_token) {
      case TokenType.Identifier:
        return {
          kind: "Identifier",
          symbol: this.next_token().value,
        } as Identifier;
      case TokenType.Number:
        return {
          kind: "NumericLiteral",
          value: parseFloat(this.next_token().value),
        } as NumericLiteral;
      case TokenType.String:
        return {
          kind: "StringLiteral",
          value: this.next_token().value,
        } as StringLiteral;

      case TokenType.OpenParen: {
        this.next_token();
        const value = this.parse_expression();
        this.expected_next(
          TokenType.CloseParen,
          "unexpected token found in parenthesized expression"
        );
        return value;
      }
      default:
        console.error(
          "unexpected token found during parsing: " + current_token
        );
        process.exit();
    }
  }
}
