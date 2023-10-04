import { RuntimeValue } from "./values";

export default class Environment {
  private parent?: Environment;
  private variables: Map<string, RuntimeValue>;

  constructor(parent_env?: Environment) {
    this.parent = parent_env;
    this.variables = new Map();
  }

  public declare_variable(variable: string, value: RuntimeValue): RuntimeValue {
    if (this.variables.has(variable)) {
      throw `Variable ${variable} already defined earlier`;
    }
    this.variables.set(variable, value);
    return value;
  }

  public assign_variable(variable: string, value: RuntimeValue): RuntimeValue {
    const env = this.resolve(variable);
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
