import Environment from "../environment";
import { mk_boolean, mk_native_function, mk_null, mk_number } from "../values";

const global = new Environment();

export function create_global_env(): Environment {
  global.declare_variable("true", mk_boolean(true), true);
  global.declare_variable("false", mk_boolean(false), true);
  global.declare_variable("null", mk_null(), true);

  global.declare_variable(
    "print",
    mk_native_function((args, env) => {
      console.log(...args);
      return mk_null();
    }),
    true
  );

  return global;
}
