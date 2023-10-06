export function is_skippable(char: string): boolean {
  const skippable_chars = [" ", "\t", "\n", "\r"];
  return skippable_chars.includes(char);
}

export function is_binary_operator(char: string): boolean {
  const binop_chars = ["+", "-", "*", "/", "%"];
  return binop_chars.includes(char);
}
