import { cleanupDemoData } from "../api/testLifecycle.js";

export default async function globalTeardown() {
  await cleanupDemoData();
}
