// One-time setup: .env, backend dependencies, database, frontend dependencies.
import { spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { requirePhp, runComposer } from './lib/php.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const backend = join(root, 'backend');
const frontend = join(root, 'frontend');

function step(message) {
  console.log(`\n\x1b[1m→ ${message}\x1b[0m`);
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const php = requirePhp();

step('Environment file');
const envPath = join(root, '.env');
if (existsSync(envPath)) {
  console.log('.env already exists, leaving it as is.');
} else {
  const secret = randomBytes(32).toString('hex');
  const contents = readFileSync(join(root, '.env.example'), 'utf8').replace(/^JWT_SECRET=.*$/m, `JWT_SECRET=${secret}`);
  writeFileSync(envPath, contents);
  console.log('Created .env with a random JWT_SECRET. Change ADMIN_PASSWORD before going live.');
}

step('Backend dependencies (composer install)');
runComposer(php, ['install', '--no-interaction'], backend);

step('Database (migrate + seed)');
run(php, ['database/migrate.php'], backend);
run(php, ['database/seed.php'], backend);

step('Frontend dependencies (npm install)');
const npm = spawnSync('npm install', { cwd: frontend, stdio: 'inherit', shell: true });
if (npm.status !== 0) process.exit(npm.status ?? 1);

console.log('\n\x1b[32mSetup complete.\x1b[0m Start everything with: npm run dev\n');
