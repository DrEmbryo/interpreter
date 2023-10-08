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
    console.log(this.tokens);
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
    }
    return this.parse_expression();
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
    let left = this.parse_primary_expression();

    while (
      this.token_at().value === "*" ||
      this.token_at().value === "/" ||
      this.token_at().value === "%"
    ) {
      const operator = this.next_token().value;
      const right = this.parse_primary_expression();
      left = {
        kind: "BinaryExpression",
        left,
        right,
        operator,
      } as BinaryExpression;
    }

    return left;
  }

  private parse_additive_expression(): Expression {
    let left = this.parse_multiplicative_expression();

    while (this.token_at().value === "+" || this.token_at().value === "-") {
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
