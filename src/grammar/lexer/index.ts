import { is_binary_operator, is_skippable } from "./rules";

export enum TokenType {
  // Literal Types
  Identifier,
  Number,
  // Keywords
  Let,
  Const,

  // Grouping/Operayors
  BinaryOperator,
  Equals,
  Coma,
  Colon,
  Semicolon,
  OpenParen,
  CloseParen,
  OpenSquareBrace,
  CloseSquareBrace,
  OpenCurlyBrace,
  CloseCurlyBrace,

  // Standalone Types
  EOF,
}

export interface Token {
  value: string;
  type: TokenType;
}

const KEY_WORDS: Record<string, TokenType> = {
  let: TokenType.Let,
  const: TokenType.Const,
};

function produceToken(value: string, type: TokenType): Token {
  return { value, type };
}

function isAlphabetic(source: string) {
  return source.toUpperCase() != source.toLowerCase();
}

function isNumeric(source: string) {
  const srcCharCode = source.charCodeAt(0);
  return srcCharCode >= "0".charCodeAt(0) && srcCharCode <= "9".charCodeAt(0);
}

export function tokenize(source: string): Token[] {
  const tokens = new Array<Token>();

  const src = source.split("");

  while (src.length > 0) {
    // single char tokens
    if (src[0] === "(") {
      tokens.push(produceToken(src.shift() as string, TokenType.OpenParen));
    } else if (src[0] === ")") {
      tokens.push(produceToken(src.shift() as string, TokenType.CloseParen));
    } else if (src[0] === "=") {
      tokens.push(produceToken(src.shift() as string, TokenType.Equals));
    } else if (src[0] === ";") {
      tokens.push(produceToken(src.shift() as string, TokenType.Semicolon));
    } else if (is_binary_operator(src[0])) {
      tokens.push(
        produceToken(src.shift() as string, TokenType.BinaryOperator)
      );
    } else if (src[0] === "{") {
      tokens.push(
        produceToken(src.shift() as string, TokenType.OpenCurlyBrace)
      );
    } else if (src[0] === "}") {
      tokens.push(
        produceToken(src.shift() as string, TokenType.CloseCurlyBrace)
      );
    } else if (src[0] === ":") {
      tokens.push(produceToken(src.shift() as string, TokenType.Colon));
    } else if (src[0] === ",") {
      tokens.push(produceToken(src.shift() as string, TokenType.Coma));
    } else if (is_skippable(src[0])) {
      src.shift();
    } else {
      // multi char tokens

      //Numerics
      if (isNumeric(src[0])) {
        let number = "";
        while (src.length > 0 && isNumeric(src[0])) {
          number += src.shift() as string;
        }
        tokens.push(produceToken(number, TokenType.Number));
      }
      //Alphabetic
      else if (isAlphabetic(src[0])) {
        let str = "";
        while (src.length > 0 && isAlphabetic(src[0])) {
          str += src.shift() as string;
        }
        // check reserved key words
        const keyword = KEY_WORDS[str];
        if (typeof keyword === "number") {
          tokens.push(produceToken(str, keyword));
        } else {
          tokens.push(produceToken(str, TokenType.Identifier));
        }
      } else {
        console.error("Unidentified token detected: ", src[0]);
      }
    }
  }
  tokens.push(produceToken("EOF", TokenType.EOF));
  return tokens;
}
