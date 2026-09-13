import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';

/**
 * Finds PHP 8.2+: $PHP_BIN, then `php` on PATH, then common Windows install folders.
 * Exits with a helpful message when none is found.
 */
export function requirePhp() {
  const candidates = [
    process.env.PHP_BIN,
    'php',
    join(homedir(), 'tools', 'php-8.3', 'php.exe'),
    'C:\\xampp\\php\\php.exe',
    'C:\\php\\php.exe',
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (candidate !== 'php' && !existsSync(candidate)) continue;
    const result = spawnSync(candidate, ['-r', 'echo PHP_VERSION;'], { encoding: 'utf8' });
    if (result.status !== 0) continue;

    const [major, minor] = result.stdout.trim().split('.').map(Number);
    if (major > 8 || (major === 8 && minor >= 2)) return candidate;
    console.error(`Found PHP ${result.stdout.trim()} at ${candidate}, but 8.2 or newer is required.`);
  }

  console.error('PHP 8.2+ was not found. Install it (see README) or set PHP_BIN to the php executable.');
  process.exit(1);
}

/** Runs Composer with the given arguments: composer.phar next to PHP if present, otherwise `composer` on PATH. */
export function runComposer(phpBin, args, cwd) {
  const phar = [phpBin !== 'php' ? join(dirname(phpBin), 'composer.phar') : null, join(homedir(), 'tools', 'php-8.3', 'composer.phar')]
    .find((path) => path && existsSync(path));

  const result = phar
    ? spawnSync(phpBin, [phar, ...args], { cwd, stdio: 'inherit' })
    : spawnSync(`composer ${args.join(' ')}`, { cwd, stdio: 'inherit', shell: true });

  if (result.status !== 0) {
    console.error('Composer failed. Is it installed? See https://getcomposer.org/download/');
    process.exit(result.status ?? 1);
  }
}
