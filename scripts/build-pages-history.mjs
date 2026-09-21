import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const [reportSource, resultsSource, pagesRoot] = process.argv.slice(2).map((value) => resolve(value));
const runNumber = process.env.GITHUB_RUN_NUMBER;
const runAttempt = process.env.GITHUB_RUN_ATTEMPT;
const reportId = `run-${runNumber}-attempt-${runAttempt}`;
const reportPath = join(pagesRoot, "reports", reportId);
const historyPath = join(pagesRoot, "reports.json");

mkdirSync(join(pagesRoot, "reports"), { recursive: true });
cpSync(reportSource, reportPath, { recursive: true, force: true });

const summary = { passed: 0, failed: 0, broken: 0, skipped: 0, unknown: 0 };

for (const name of readdirSync(resultsSource)) {
  if (!name.endsWith("-result.json")) continue;

  const result = JSON.parse(readFileSync(join(resultsSource, name), "utf8"));
  const status = Object.hasOwn(summary, result.status) ? result.status : "unknown";
  summary[status] += 1;
}

const previous = existsSync(historyPath)
  ? JSON.parse(readFileSync(historyPath, "utf8"))
  : [];
const reports = previous.filter((report) => report.id !== reportId);

reports.unshift({
  id: reportId,
  runNumber: Number(runNumber),
  runAttempt: Number(runAttempt),
  workflowName: process.env.GITHUB_WORKFLOW,
  createdAt: new Date().toISOString(),
  ref: process.env.TF_VAR_app_ref,
  sha: process.env.GITHUB_SHA?.slice(0, 7),
  workflowUrl: `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`,
  reportUrl: `reports/${reportId}/index.html`,
  summary
});

const successfulReports = reports
  .filter((report) => report.summary.failed + report.summary.broken === 0)
  .slice(0, 3);
const latestFailedReport = reports.find(
  (report) => report.summary.failed + report.summary.broken > 0
);
const retainedReportIds = new Set([
  ...successfulReports.map((report) => report.id),
  ...(latestFailedReport ? [latestFailedReport.id] : [])
]);
const retainedReports = reports.filter((report) => retainedReportIds.has(report.id));

for (const name of readdirSync(join(pagesRoot, "reports"))) {
  if (name.startsWith("run-") && !retainedReportIds.has(name)) {
    rmSync(join(pagesRoot, "reports", name), { recursive: true, force: true });
  }
}

writeFileSync(historyPath, `${JSON.stringify(retainedReports, null, 2)}\n`);

const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
})[character]);

const cards = retainedReports.map((report) => {
  const { passed, failed, broken, skipped, unknown } = report.summary;
  const outcome = failed + broken > 0 ? "failed" : "passed";
  const date = new Date(report.createdAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC"
  });

  return `
    <article class="report ${outcome}">
      <div>
        <h2><a href="${escapeHtml(report.reportUrl)}">Run #${report.runNumber}</a>${report.workflowName ? ` <span class="workflow-name">${escapeHtml(report.workflowName)}</span>` : ""}</h2>
        <p>${escapeHtml(date)} UTC · attempt ${report.runAttempt} · app ref ${escapeHtml(report.ref)} · ${escapeHtml(report.sha)}</p>
      </div>
      <div class="summary" aria-label="Test summary">
        <span class="pass">${passed} passed</span>
        <span class="fail">${failed} failed</span>
        <span class="broken">${broken} broken</span>
        <span>${skipped} skipped</span>
        ${unknown ? `<span>${unknown} unknown</span>` : ""}
      </div>
      <div class="links"><a class="button" href="${escapeHtml(report.reportUrl)}">Open report</a><a href="${escapeHtml(report.workflowUrl)}">Workflow run</a></div>
    </article>`;
}).join("\n");

writeFileSync(join(pagesRoot, "index.html"), `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Car Shop test reports</title>
  <style>
    :root { color-scheme: light dark; font-family: system-ui, sans-serif; }
    body { max-width: 1100px; margin: 0 auto; padding: 32px 20px; background: #f6f8fa; color: #1f2328; }
    header { margin-bottom: 28px; }
    h1 { margin-bottom: 6px; }
    header p, .report p { color: #59636e; }
    .report { background: white; border: 1px solid #d0d7de; border-left: 5px solid #1f883d; border-radius: 8px; margin: 14px 0; padding: 18px; display: grid; grid-template-columns: 1fr auto; gap: 12px 24px; }
    .report.failed { border-left-color: #cf222e; }
    .report h2, .report p { margin: 0 0 6px; }
    a { color: #0969da; }
    .summary, .links { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; }
    .summary span { background: #eaeef2; border-radius: 999px; padding: 5px 10px; font-weight: 600; }
    .summary .pass { color: #116329; background: #dafbe1; }
    .summary .fail, .summary .broken { color: #82071e; background: #ffebe9; }
    .links { grid-column: 1 / -1; }
    .button { color: white; background: #0969da; border-radius: 6px; padding: 7px 12px; text-decoration: none; }
    @media (max-width: 700px) { .report { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <header><h1>Car Shop test reports</h1><p>The latest three successful runs and latest failed run are retained. Select a run to open its complete Allure report.</p></header>
  <main>${cards || "<p>No reports have been published yet.</p>"}</main>
</body>
</html>\n`);

writeFileSync(join(pagesRoot, ".nojekyll"), "");
