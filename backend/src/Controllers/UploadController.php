<?php

declare(strict_types=1);

namespace Yenko\Controllers;

use finfo;
use Yenko\Http\HttpException;
use Yenko\Http\Request;
use Yenko\Http\Response;
use Yenko\Support\Config;

final class UploadController
{
    private const EXTENSIONS = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];

    /** POST /api/admin/uploads (multipart/form-data, field "image") */
    public function store(Request $request): Response
    {
        $maxMb = Config::int('UPLOAD_MAX_MB', 5);
        $tooLarge = new HttpException(413, "That image is too large. The limit is {$maxMb} MB.");

        // When the body exceeds post_max_size PHP silently drops $_FILES, so check the declared length first.
        if ((int) ($request->header('content-length') ?? 0) > self::iniBytes((string) ini_get('post_max_size'))) {
            throw $tooLarge;
        }

        $file = $request->files['image'] ?? null;
        if (!is_array($file) || !isset($file['error']) || is_array($file['error']) || $file['error'] === UPLOAD_ERR_NO_FILE) {
            throw HttpException::validation(['image' => 'Choose an image to upload.']);
        }
        if (in_array($file['error'], [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true) || $file['size'] > $maxMb * 1024 * 1024) {
            throw $tooLarge;
        }
        if ($file['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($file['tmp_name'])) {
            throw new HttpException(500, 'The upload failed on the server. Please try again.');
        }

        // Trust the file's contents, not its name or the browser-supplied type.
        $mimeType = (string) (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
        $extension = self::EXTENSIONS[$mimeType] ?? null;
        $dimensions = $extension !== null ? @getimagesize($file['tmp_name']) : false;
        if ($dimensions === false) {
            throw new HttpException(415, 'Only JPG, PNG or WebP images can be uploaded.');
        }

        $subdirectory = gmdate('Y/m');
        $directory = Config::uploadPath() . '/' . $subdirectory;
        if (!is_dir($directory) && !mkdir($directory, 0775, true) && !is_dir($directory)) {
            throw new HttpException(500, 'The upload folder could not be created.');
        }

        $filename = bin2hex(random_bytes(12)) . '.' . $extension;
        if (!move_uploaded_file($file['tmp_name'], "{$directory}/{$filename}")) {
            throw new HttpException(500, 'The upload could not be saved. Please try again.');
        }
        @chmod("{$directory}/{$filename}", 0644);

        return Response::json([
            'data' => [
                'url' => "/uploads/{$subdirectory}/{$filename}",
                'width' => $dimensions[0],
                'height' => $dimensions[1],
                'size' => (int) $file['size'],
                'mimeType' => $mimeType,
            ],
        ], 201);
    }

    /** Converts php.ini sizes such as "8M" to bytes. */
    private static function iniBytes(string $value): int
    {
        $value = trim($value);
        $number = (int) $value;

        return match (strtoupper(substr($value, -1))) {
            'G' => $number * 1024 ** 3,
            'M' => $number * 1024 ** 2,
            'K' => $number * 1024,
            default => $number,
        } ?: PHP_INT_MAX;
    }
}
