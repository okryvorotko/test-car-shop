import { randomUUID } from "node:crypto";
import { config } from "../utils/config.js";

export function uniqueUser(prefix = "qa-user") {
  const id = randomUUID();

  return {
    username: `${prefix}-${id}`,
    password: config.testPassword
  };
}
