<?php

declare(strict_types=1);

// Usage: php database/migrate.php [--fresh]
// Creates any missing tables. --fresh drops every table first (all data is lost).

use Yenko\Support\Database;

require dirname(__DIR__) . '/src/bootstrap.php';

$fresh = in_array('--fresh', $argv, true);
$driver = Database::driver();
$schemaFile = __DIR__ . "/schema.{$driver}.sql";

if (!is_file($schemaFile)) {
    fwrite(STDERR, "No schema file for DB_DRIVER \"{$driver}\" (expected {$schemaFile})." . PHP_EOL);
    exit(1);
}

try {
    $pdo = Database::connection();

    if ($fresh) {
        // Children before parents so foreign keys don't block the drop.
        foreach (['site_settings', 'rate_limit_hits', 'contact_submissions', 'posts', 'categories', 'admin_users'] as $table) {
            $pdo->exec("DROP TABLE IF EXISTS {$table}");
        }
        echo 'Dropped all tables.' . PHP_EOL;
    }

    $sql = preg_replace('/^\s*--.*$/m', '', (string) file_get_contents($schemaFile)) ?? '';
    foreach (preg_split('/;\s*$/m', $sql) ?: [] as $statement) {
        if (trim($statement) !== '') {
            $pdo->exec($statement);
        }
    }

    echo "Schema applied ({$driver})." . PHP_EOL;
} catch (Throwable $e) {
    fwrite(STDERR, 'Migration failed: ' . $e->getMessage() . PHP_EOL);
    exit(1);
}
