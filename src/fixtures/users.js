import { config } from "../utils/config.js";

export function uniqueUser(prefix = "qa-user") {
  const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return {
    username: `${prefix}-${id}`,
    password: config.testPassword
  };
}
