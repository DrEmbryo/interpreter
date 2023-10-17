export enum TokenType {
  // Literal Types
  Identifier,
  Number,
  String,

  // Keywords
  Let,
  Const,
  Function,

  // Grouping / Operators
  BinaryOperator,
  Equals,
  Coma,
  Dot,
  Colon,
  Semicolon,
  OpenParen,
  CloseParen,
  OpenSquareBrace,
  CloseSquareBrace,
  OpenCurlyBrace,
  CloseCurlyBrace,
  DoubleQuote,
  // Standalone Types
  EOF,
}

export interface Token {
  value: string;
  type: TokenType;
}

export const SINGLE_CHAR_TOKEN: Record<string, TokenType> = {
  "=": TokenType.Equals,
  ",": TokenType.Coma,
  ".": TokenType.Dot,
  ":": TokenType.Colon,
  ";": TokenType.Semicolon,
  "(": TokenType.OpenParen,
  ")": TokenType.CloseParen,
  "{": TokenType.OpenCurlyBrace,
  "}": TokenType.CloseCurlyBrace,
  "[": TokenType.OpenSquareBrace,
  "]": TokenType.CloseSquareBrace,
  // Bin op's
  "+": TokenType.BinaryOperator,
  "-": TokenType.BinaryOperator,
  "*": TokenType.BinaryOperator,
  "/": TokenType.BinaryOperator,
  "%": TokenType.BinaryOperator,
  "<": TokenType.BinaryOperator,
  ">": TokenType.BinaryOperator,
};

export const MULTI_CHAR_TOKEN: Record<string, TokenType> = {
  '"': TokenType.DoubleQuote,
};

export const KEY_WORDS: Record<string, TokenType> = {
  let: TokenType.Let,
  const: TokenType.Const,
  function: TokenType.Function,
};

export function is_skippable(char: string): boolean {
  const skippable_chars = [" ", "\t", "\n", "\r"];
  return skippable_chars.includes(char);
}
