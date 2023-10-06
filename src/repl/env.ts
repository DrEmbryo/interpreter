import Parser from "../grammar/parser";
import { create_global_env } from "../runtime/environment";

export const parser = new Parser();
export const env = create_global_env();
