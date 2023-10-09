import {
  KEY_WORDS,
  SINGLE_CHAR_TOKEN,
  MULTI_CHAR_TOKEN,
  Token,
  TokenType,
  is_skippable,
} from "./rules";

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
    if (typeof SINGLE_CHAR_TOKEN[src[0]] == "number") {
      const type = SINGLE_CHAR_TOKEN[src[0]];
      tokens.push(produceToken(src.shift() as string, type));
    } else if (is_skippable(src[0])) {
      src.shift();
    } else {
      // multi char tokens
      if (typeof MULTI_CHAR_TOKEN[src[0]] == "number") {
        if (MULTI_CHAR_TOKEN[src[0]] === TokenType.DoubleQuote) {
          src.shift();
          let str = "";
          while (
            src.length > 0 &&
            MULTI_CHAR_TOKEN[src[0]] !== TokenType.DoubleQuote
          ) {
            str += src.shift() as string;
          }
          tokens.push(produceToken(str, TokenType.String));
          src.shift();
        }
      }
      //Numerics
      else if (isNumeric(src[0])) {
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
