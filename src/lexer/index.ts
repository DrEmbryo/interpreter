export enum TokenType {
  Identifier,
  Number,
  Equals,
  OpenParen,
  CloseParen,
  BinaryOperator,
  Let,
  EOF,
}

export interface Token {
  value: string;
  type: TokenType;
}

const KEY_WORDS: Record<string, TokenType> = {
  let: TokenType.Let,
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
    const char = src.shift() as string;
    // single char tokens
    if (char === "(") {
      tokens.push(produceToken(char, TokenType.OpenParen));
    } else if (char === ")") {
      tokens.push(produceToken(char, TokenType.CloseParen));
    } else if (char === "=") {
      tokens.push(produceToken(char, TokenType.Equals));
    } else if (char === "+" || char === "-" || char === "*" || char === "/") {
      tokens.push(produceToken(char, TokenType.BinaryOperator));
    } else {
      // multi char tokens

      //Numerics
      if (isNumeric(char)) {
        let number = "";
        let current = char;
        while (src.length > 0 && isNumeric(current)) {
          number += current;
          current = src.shift() as string;
        }
        tokens.push(produceToken(number, TokenType.Number));
      }
      //Alphabetic
      else if (isAlphabetic(char)) {
        console.log(char);
        let str = "";
        let current = char;
        while (src.length > 0 && isAlphabetic(current)) {
          str += current;
          current = src.shift() as string;
        }
        // check reserved key words
        tokens.push(
          produceToken(
            str,
            KEY_WORDS[str] ? KEY_WORDS[str] : TokenType.Identifier
          )
        );
      } else {
        console.error("Unidentified token detected: ", char);
      }
    }
  }
  tokens.push(produceToken("EOF", TokenType.EOF));
  return tokens;
}

console.log(tokenize("let x = 6 + ( 7 + y ) "));
