import {
  Statement,
  Expression,
  BinaryExpression,
  Identifier,
  NumericLiteral,
  Program,
} from "../ast/astNodeTypes";

import { Token, TokenType, tokenize } from "../lexer";

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
    return this.parse_expression();
  }

  private parse_expression(): Expression {
    return this.pars_additive_expression();
  }

  private pars_multiplicative_expression(): Expression {
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

  private pars_additive_expression(): Expression {
    let left = this.pars_multiplicative_expression();

    while (this.token_at().value === "+" || this.token_at().value === "-") {
      const operator = this.next_token().value;
      const right = this.pars_multiplicative_expression();
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
