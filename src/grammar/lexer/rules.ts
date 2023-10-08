export enum TokenType {
  // Literal Types
  Identifier,
  Number,

  // Keywords
  Let,
  Const,

  // Grouping / Operators
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

export const SINGLE_CHAR_TOKEN: Record<string, TokenType> = {
  "=": TokenType.Equals,
  ",": TokenType.Coma,
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
};

export const KEY_WORDS: Record<string, TokenType> = {
  let: TokenType.Let,
  const: TokenType.Const,
};

export function is_skippable(char: string): boolean {
  const skippable_chars = [" ", "\t", "\n", "\r"];
  return skippable_chars.includes(char);
}
