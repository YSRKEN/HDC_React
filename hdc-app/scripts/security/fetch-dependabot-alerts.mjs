import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const REPOSITORY = 'YSRKEN/HDC_React';
const reportDir = path.resolve(process.cwd(), 'security-reports');
const outputPath = path.join(reportDir, 'dependabot-alerts-open.json');
const preferredGhPath = process.env.GH_EXE ?? 'C:\\Program Files\\GitHub CLI\\gh.exe';
const ghBin = existsSync(preferredGhPath) ? preferredGhPath : 'gh';
const ghConfigDir = process.env.GH_CONFIG_DIR ?? path.join(reportDir, '.gh-config');

mkdirSync(reportDir, { recursive: true });
mkdirSync(ghConfigDir, { recursive: true });

let token = process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN;
if (!token) {
  try {
    token = execFileSync(ghBin, ['auth', 'token'], {
      encoding: 'utf8',
      env: { ...process.env }
    }).trim();
  } catch (_error) {
    token = '';
  }
}

if (!token) {
  writeFileSync(
    outputPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        repository: REPOSITORY,
        skipped: true,
        reason: 'GH_TOKEN もしくは GITHUB_TOKEN が未設定のため取得をスキップしました。',
        alerts: []
      },
      null,
      2
    )
  );
  console.warn('[security] GH token が未設定のため Dependabot alerts 取得をスキップしました。');
  process.exit(0);
}

const env = {
  ...process.env,
  GH_CONFIG_DIR: ghConfigDir,
  GH_TOKEN: token
};

const rawResponse = execFileSync(
  ghBin,
  ['api', `repos/${REPOSITORY}/dependabot/alerts`, '--paginate', '--slurp'],
  { encoding: 'utf8', env }
);

const pages = JSON.parse(rawResponse);
const allAlerts = Array.isArray(pages) ? pages.flat() : [];
const openAlerts = allAlerts.filter(alert => alert?.state === 'open');

const normalizedAlerts = openAlerts.map(alert => ({
  number: alert.number,
  state: alert.state,
  created_at: alert.created_at,
  updated_at: alert.updated_at,
  html_url: alert.html_url,
  dependency_scope: alert.dependency?.scope ?? null,
  ecosystem:
    alert.dependency?.package?.ecosystem ??
    alert.security_vulnerability?.package?.ecosystem ??
    null,
  package:
    alert.dependency?.package?.name ??
    alert.security_vulnerability?.package?.name ??
    null,
  severity: alert.security_vulnerability?.severity ?? null,
  summary: alert.security_advisory?.summary ?? null,
  fixed_in: alert.security_vulnerability?.first_patched_version?.identifier ?? null
}));

const summaryBySeverity = normalizedAlerts.reduce((acc, alert) => {
  const severity = alert.severity ?? 'unknown';
  acc[severity] = (acc[severity] ?? 0) + 1;
  return acc;
}, {});

const report = {
  generatedAt: new Date().toISOString(),
  repository: REPOSITORY,
  count: normalizedAlerts.length,
  summaryBySeverity,
  alerts: normalizedAlerts
};

writeFileSync(outputPath, JSON.stringify(report, null, 2));
console.log(`[security] Dependabot open alerts: ${normalizedAlerts.length}`);
