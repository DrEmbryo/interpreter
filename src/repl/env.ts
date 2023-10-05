import Parser from "../parser";
import Environment from "../runtime/environment";
import { mk_boolean, mk_null, mk_number } from "../runtime/values";

export const parser = new Parser();
export const env = new Environment();

env.declare_variable("x", mk_number(5), false);
env.declare_variable("true", mk_boolean(true), true);
env.declare_variable("false", mk_boolean(false), true);
env.declare_variable("null", mk_null(), true);
