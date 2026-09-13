# Deploying to Hostinger with GitHub

Every push to the `main` branch builds the site and uploads it to Hostinger automatically. The workflow is [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

```
GitHub (push to main)
  └─ GitHub Actions: install, build the React site, install PHP packages, check the code
       └─ FTP upload to Hostinger
            ├─ domains/yourdomain.com/public_html/   website, /api entry point, /uploads
            └─ domains/yourdomain.com/yenko-backend/ PHP backend (not publicly reachable)
```

Hostinger's built-in Git deployment isn't used, because it can't build the React site.

What stays on the server between deployments: `yenko-backend/.env`, the database and every image uploaded in the admin panel. The workflow only replaces files it uploaded itself.

---

## 1. Put the code on GitHub

1. Create an **empty private repository** on GitHub, without a README or .gitignore.
2. In the project folder, run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-ACCOUNT/yenko-mobility.git
   git push -u origin main
   ```

`.gitignore` already keeps these out of Git: `.env` (passwords and secrets), the local database, uploaded images, `node_modules`, `backend/vendor` and build output.

This first push starts a deployment. It fails at "Check the FTP secrets are set" until you finish step 3. That's expected.

---

## 2. Prepare Hostinger

In **hPanel → Websites → Manage** for your domain:

1. **PHP version:** Advanced → PHP Configuration → choose **PHP 8.3** (8.2 or newer works).
2. **SSL:** Security → SSL → install the free certificate. Then turn on **Force HTTPS**.
3. **FTP details:** Files → FTP Accounts. Note the **FTP IP** (or hostname), **username** and **password**. Use "Change FTP password" if you don't know it.
4. **Remove the placeholder page:** Files → File Manager → `public_html`. Delete `default.php`, if it's there.

---

## 3. Add the secrets to GitHub

In your repository, go to **Settings → Secrets and variables → Actions**.

**Secrets** tab → *New repository secret*:

| Name | Value |
|---|---|
| `FTP_SERVER` | FTP IP or hostname from hPanel, e.g. `153.92.x.x` or `ftp.yourdomain.com` |
| `FTP_USERNAME` | FTP username, e.g. `u123456789.yourdomain.com` |
| `FTP_PASSWORD` | FTP password |

**Variables** tab: all optional. Only add them if the defaults don't fit.

| Name | Default | When to change it |
|---|---|---|
| `FTP_WEB_DIR` | `public_html/` | See "Which folders?" below |
| `FTP_BACKEND_DIR` | `yenko-backend/` | See "Which folders?" below |
| `FTP_PROTOCOL` | `ftp` | Set to `ftps` for an encrypted connection, if your plan supports it |
| `FTP_PORT` | `21` | Rarely needed |
| `VITE_ADMIN_PATH` | `/login-yenkoadmin` | To move the admin panel to a different URL |

### Which folders?

Connect with an FTP app such as FileZilla, using the details above, and look at the first folder you land in:

| You see… | `FTP_WEB_DIR` | `FTP_BACKEND_DIR` |
|---|---|---|
| `public_html` (often with a `DO_NOT_UPLOAD_HERE` file) | leave the default | leave the default |
| `domains` | `domains/yourdomain.com/public_html/` | `domains/yourdomain.com/yenko-backend/` |
| The website files themselves (you're already inside `public_html`) | `./` | `yenko-backend/` |

In the last case the backend goes inside `public_html`. That's fine: its `.htaccess` blocks public access, and the site finds it automatically.

### Run the deployment

**Actions → Deploy to Hostinger → Run workflow**, or push a new commit. The first upload takes several minutes, because it includes every PHP package. Later deployments only upload changed files.

---

## 4. First-time server setup (once)

### a. Create the backend settings

In hPanel **File Manager**, open `yenko-backend/`:

1. Copy `.env.example` and name the copy `.env`.
2. Edit `.env`:
   - `ADMIN_EMAIL`: the email address you'll sign in with.
   - `ADMIN_PASSWORD`: a strong password. Use at least 12 characters.
   - Keep the `JWT_SECRET` that's already filled in.
   - Database:
     - **SQLite (simplest):** leave the database settings as they are.
     - **MySQL:** create a database in hPanel → Databases → MySQL Databases, then set `DB_DRIVER=mysql`, `DB_HOST=localhost`, `DB_NAME`, `DB_USER` and `DB_PASSWORD`.

Only create `.env` once. Later deployments update `.env.example` but never touch your `.env`.

### b. Create the database tables and admin account

**With SSH** (Premium and Business plans; enable it in hPanel → Advanced → SSH Access):

```bash
ssh -p 65002 u123456789@YOUR-SERVER-IP
cd domains/yourdomain.com/yenko-backend
php database/migrate.php
php database/seed.php
```

If `php -v` shows an old version, use `/opt/alt/php83/usr/bin/php` in place of `php`.

**Without SSH**, use a temporary cron job: hPanel → Advanced → Cron Jobs → Custom.

1. Command:
   ```
   cd /home/u123456789/domains/yourdomain.com/yenko-backend && /usr/bin/php database/migrate.php && /usr/bin/php database/seed.php
   ```
2. Schedule it for every minute.
3. After 2 minutes, **delete the cron job**. The seed step adds demo posts, and you don't want that repeated.

`seed.php` creates the admin account from `.env`, the three blog categories, the eight demo posts and the default pricing. You can delete the demo posts in the admin panel.

### c. Check it works

1. Open `https://yourdomain.com/api/health`. It should show `{"status":"ok",...}`.
2. Open `https://yourdomain.com`. Also refresh a page such as `/pricing`, which should still load.
3. Sign in at `https://yourdomain.com/login-yenkoadmin`.

---

## 5. Everyday updates

Push to `main`, or merge a pull request into it, and the site updates in a few minutes. Follow progress in the **Actions** tab.

When a release adds new database tables, run `php database/migrate.php` once on the server. It never deletes data. To run it automatically after every deployment, add these variables and secret:

| Type | Name | Value |
|---|---|---|
| Variable | `SSH_HOST` | Server IP from hPanel → SSH Access |
| Variable | `SSH_PORT` | `65002` |
| Variable | `SSH_USERNAME` | e.g. `u123456789` |
| Variable | `SSH_BACKEND_PATH` | e.g. `/home/u123456789/domains/yourdomain.com/yenko-backend` |
| Secret | `SSH_PASSWORD` | SSH password |

**Changing the admin password:** edit `ADMIN_PASSWORD` in the server's `yenko-backend/.env`. Then run `php database/seed.php` once, using SSH or the cron method.

---

## Content created on your computer

Posts, pricing changes and images you created locally are **not** uploaded. Git ignores the database and uploads on purpose. Either recreate them in the live admin panel, or copy them over once:

- If the server uses SQLite, upload `backend/database/yenko.sqlite` to `yenko-backend/database/`.
- Upload the contents of `backend/public/uploads/` to `public_html/uploads/`.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Workflow fails at "Check the FTP secrets are set" | Add the three `FTP_*` secrets (step 3) |
| Upload step fails with a login or timeout error | Check the FTP details. Re-run the workflow; it continues where it stopped. |
| Files uploaded to the wrong folder | Set `FTP_WEB_DIR` and `FTP_BACKEND_DIR` (see "Which folders?"). Delete the misplaced files, including the `.ftp-deploy-*.json` state file, then re-run the workflow. |
| Hostinger placeholder page still showing | Delete `default.php` from `public_html` |
| Pages show 404 when refreshed | `public_html/.htaccess` is missing. Make sure hidden files were uploaded. |
| `/api/health` says "The backend was not found" | `yenko-backend` isn't next to or inside `public_html` |
| `/api/...` returns "Missing environment variable" | Create `yenko-backend/.env` (step 4a) |
| `/api/...` returns "no such table" | Run `php database/migrate.php` (step 4b) |
| Can't sign in, or you're signed out straight away | Use `https://`: the session cookie is HTTPS-only. Re-run `seed.php` after changing the admin details. |
| Image uploads fail | Make sure `public_html/uploads/` exists and is writable (permissions 755) |

## Deploying without GitHub

Run `npm run package` on your computer and upload the two folders from `deploy/` with File Manager or FTP. The steps are in `deploy/README-DEPLOY.md`.
