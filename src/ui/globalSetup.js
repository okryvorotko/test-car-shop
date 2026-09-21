import { cleanupDemoData, ensureApiIsReady } from "../api/testLifecycle.js";

export default async function globalSetup() {
  await ensureApiIsReady();
  await cleanupDemoData();
}
