import { RuntimeValue, mk_boolean, mk_null, mk_number } from "./values";

export function create_global_env(): Environment {
  const env = new Environment();
  env.declare_variable("x", mk_number(5), false);
  env.declare_variable("true", mk_boolean(true), true);
  env.declare_variable("false", mk_boolean(false), true);
  env.declare_variable("null", mk_null(), true);
  return env;
}

export default class Environment {
  private parent?: Environment;
  private variables: Map<string, RuntimeValue>;
  private constants: Set<string>;

  constructor(parent_env?: Environment) {
    this.parent = parent_env;
    this.variables = new Map();
    this.constants = new Set();
  }

  public declare_variable(
    variable: string,
    value: RuntimeValue,
    constant: boolean
  ): RuntimeValue {
    if (this.variables.has(variable)) {
      throw `Variable ${variable} already defined earlier`;
    }

    this.variables.set(variable, value);

    if (constant) {
      this.constants.add(variable);
    }
    return value;
  }

  public assign_variable(variable: string, value: RuntimeValue): RuntimeValue {
    const env = this.resolve(variable);
    if (env.constants.has(variable)) {
      throw `Constant ${variable} can't be reassigned`;
    }
    env.variables.set(variable, value);
    return value;
  }

  public get_variable_value(variable: string): RuntimeValue {
    const env = this.resolve(variable);
    return env.variables.get(variable) as RuntimeValue;
  }

  public resolve(variable: string): Environment {
    if (this.variables.has(variable)) return this;
    if (typeof this.parent == "undefined") {
      throw `Can't resolve ${variable} as it is not exists in any scope`;
    }
    return this.parent.resolve(variable);
  }
}
