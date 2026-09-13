// Starts the PHP API (port 8000) and the Vite website (port 5173) together. Ctrl+C stops both.
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { requirePhp } from './lib/php.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const backend = join(root, 'backend');
const frontend = join(root, 'frontend');
const viteBin = join(frontend, 'node_modules', 'vite', 'bin', 'vite.js');

if (!existsSync(join(root, '.env')) || !existsSync(join(backend, 'vendor', 'autoload.php')) || !existsSync(viteBin)) {
  console.error('Setup has not been run yet. Run: npm run setup');
  process.exit(1);
}

const adminPath = readFileSync(join(root, '.env'), 'utf8').match(/^VITE_ADMIN_PATH=(.+)$/m)?.[1]?.trim() || '/login-yenkoadmin';
const php = requirePhp();
const children = [];
let stopping = false;

function stopAll(code) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (child.exitCode === null) child.kill();
  }
  setTimeout(() => process.exit(code), 300);
}

function start(name, color, command, args, cwd) {
  const env = { ...process.env, FORCE_COLOR: '1' };
  delete env.NO_COLOR;
  const child = spawn(command, args, { cwd, env });
  const prefix = `\x1b[${color}m[${name}]\x1b[0m `;

  const forward = (stream, target) => {
    let buffer = '';
    stream.on('data', (chunk) => {
      buffer += chunk;
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop();
      for (const line of lines) target.write(prefix + line + '\n');
    });
  };
  forward(child.stdout, process.stdout);
  forward(child.stderr, process.stderr);

  child.on('exit', (code) => {
    if (!stopping) console.log(`${prefix}stopped (exit code ${code}). Stopping the other server too.`);
    stopAll(code ?? 0);
  });
  children.push(child);
}

start('api', '36', php, ['-d', 'upload_max_filesize=8M', '-d', 'post_max_size=10M', '-S', '127.0.0.1:8000', '-t', 'public', 'public/router.php'], backend);
start('web', '33', process.execPath, [viteBin, '--clearScreen', 'false'], frontend);

process.on('SIGINT', () => stopAll(0));
process.on('SIGTERM', () => stopAll(0));

console.log(`
  \x1b[1mYenko Mobility\x1b[0m
  Website      http://localhost:5173
  Admin panel  http://localhost:5173${adminPath}
  API          http://127.0.0.1:8000/api/health
`);
