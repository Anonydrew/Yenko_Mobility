# Yenko Mobility

Company website, blog and admin panel for Yenko Mobility: campus e-bikes, shared rides, delivery, rent-to-own bikes, corporate plans and franchising in Ghana.

| Part | Stack |
|---|---|
| Website | React 18, Vite, TypeScript, React Router v6, Tailwind CSS |
| Backend | PHP 8.2+ (no framework), PDO, JWT in an httpOnly cookie |
| Database | SQLite by default, MySQL optional |
| Hosting | GitHub Actions builds and uploads to Hostinger. See **[DEPLOYMENT.md](DEPLOYMENT.md)**. |

What's included:
- Backend API, database schema and seed data
- Dark theme with an OpenAI-style header and footer and Bolt-style page sections
- Marketing pages, one page per service, a sitemap and a photo credits page
- Webflow-style pricing page, managed in the admin panel
- Blog with category filters and pagination
- Admin panel at `/login-yenkoadmin`: posts, categories, pricing and form submissions

---

## Quick start

You need **Node.js 20.19+**, **PHP 8.2+** and **Composer** (see [Requirements](#requirements)).

```bash
npm run setup    # once: creates .env, installs everything, builds and seeds the database
npm run dev      # starts the website and the API together
```

| What | URL |
|---|---|
| **Website** | <http://localhost:5173> |
| **Admin panel** | <http://localhost:5173/login-yenkoadmin> |
| API health check | <http://127.0.0.1:8000/api/health> |

Admin login: the `ADMIN_EMAIL` and `ADMIN_PASSWORD` values from `.env`. Out of the box these are `admin@yenkomobility.com` / `change-me-please-2026`. **Change the password before going live:** edit `.env`, then run `composer seed` inside `backend/`.

Press `Ctrl+C` to stop both servers.

> **Open the website on port 5173, not 8000.** Port 8000 is only the API and returns JSON, not web pages.
>
> If `php` or `composer` "isn't recognised" in the VS Code terminal after installing PHP, restart VS Code so it picks up the new PATH. `npm run dev` and `npm run setup` find PHP on their own, so they work either way.

### All commands

| Command (run in the project root) | What it does |
|---|---|
| `npm run setup` | One-time setup: `.env`, Composer and npm packages, database |
| `npm run dev` | Website on :5173 and API on :8000 together |
| `npm run build` | Type-checks and builds the website into `frontend/dist` |
| `npm run package` | Builds a ready-to-upload copy of everything in `deploy/` |

---

## Pages

Every page is linked from the header or footer, and all of them are listed on `/sitemap`. Unknown URLs show a styled 404 page.

| Section | Pages |
|---|---|
| Home | `/` |
| Products | `/products/e-bikes`, `/services/shared-rides`, `/services/delivery`, `/services/rent-to-own`, `/services/corporate`, `/services/business`, `/pricing`, `/locations` (plus one page per campus, e.g. `/locations/knust`), `/download` |
| How it works | `/how-it-works`, `/safety`, `/faq` (searchable), `/join` |
| Company | `/about`, `/mission`, `/sustainability`, `/careers`, `/partnerships` (enquiry form) |
| Help & Support | `/support`, `/terms`, `/privacy`, `/safety-guidelines`, `/contact` (contact form), `/brand` |
| Blog | `/blog`, `/blog/category/:slug`, `/blog/:slug` |
| Resources | `/credits` (photo credits), `/sitemap` |
| Admin | `/login-yenkoadmin` (not linked publicly, and excluded from search engines) |

The contact, waitlist and partnership forms save to the database. Submissions appear in the admin panel under **Submissions**.

---

## Using the admin panel

Go to **`/login-yenkoadmin`** and sign in.

- **Posts:** every post, including drafts, with search and filters for status and category. Edit, view on the site or delete from the table.
- **New / edit post:**
  - The web address (slug) is created from the title automatically. You can edit it.
  - Write the body in Markdown. **Split** view shows a live preview as you type, and the toolbar adds formatting or uploads images into the text.
  - Choose a **category**, upload a **cover image** (drag and drop works) and optionally write an **excerpt**. If you leave the excerpt empty, the start of the post is used.
  - **Save draft** keeps the post private. **Publish** puts it live. Set a future **publish date** to schedule it.
  - Press `Ctrl + S` to save at any time. The editor warns you before you leave with unsaved changes.
- **Categories:** add, rename or delete categories. A category that still has posts can't be deleted.
- **Pricing:** everything on the `/pricing` page.
  - **Tabs** (Rides, Delivery, Rent to own, Business): add, rename, reorder or delete. The tab ID is used in links such as `/pricing?tab=delivery`.
  - **Billing options** (e.g. Monthly and Yearly): each plan gets a separate price for every option. With no options, a plan has one price.
  - **Plans:** name, description, button, "Most popular" badge and feature list. Reorder, duplicate or delete them.
  - **Each price** has four parts:
    - An **amount**. Leave it empty to show "Custom" or your own label.
    - The text after it, e.g. `/day`.
    - **Included usage**: quantity, unit (minutes, hours, km, rides, deliveries…) and "per", e.g. *45 min per ride* or *5 km*.
    - An **extra usage rate**, e.g. *GH₵ 0.30 per extra min* or *GH₵ 1.50 per km*.

    A live preview shows exactly what visitors will see.
  - **Comparison table:** the Price, Included usage and Extra usage rows are built automatically. Add other rows with ✓, — or short text per plan.
  - **Add-ons and extra fees**, and **payment methods**.
  - **Save pricing** (or `Ctrl + S`) publishes the changes immediately. **Discard changes** undoes unsaved edits. **Restore defaults** goes back to `backend/database/seed/pricing.json`.
- **Submissions:** messages from the contact, waitlist and partnership forms, filterable by topic, with a "Reply by email" link.

Images are uploaded to `backend/public/uploads/` (JPG, PNG or WebP, up to 5 MB).

To change the admin URL, set `VITE_ADMIN_PATH` in `.env` and restart `npm run dev`, or rebuild for production. On GitHub, set the `VITE_ADMIN_PATH` repository variable.

---

## Customising content

| To change… | Edit |
|---|---|
| Logo | Replace `frontend/public/brand/logo.svg` and `frontend/public/favicon.svg`. If your logo includes the name, set `showWordmark: false` in `frontend/src/config/site.ts`. |
| App Store / Google Play badges | Replace `frontend/public/brand/app-store.svg` and `app-android.svg` |
| Photos | Replace files in `frontend/public/images/` (keep the names), or change paths in `frontend/src/content/media.ts`. Then update `frontend/src/content/credits.ts`. |
| Header and footer links | `frontend/src/content/navigation.ts` |
| Services (shared rides, delivery, rent-to-own, corporate, business) | `frontend/src/content/services.ts`, including the "From GH₵…" labels on service cards |
| Campuses (stats, hours, places) | `frontend/src/content/locations.ts` |
| Prices, plans, add-ons | The admin panel → **Pricing**. Pricing FAQs are in `frontend/src/content/pricing.ts`. |
| FAQs | `frontend/src/content/faqs.ts` |
| Safety tips and guidelines | `frontend/src/content/safety.ts` |
| Job openings, perks and values | `frontend/src/content/careers.ts` |
| Terms and privacy text | `frontend/src/content/legal.ts` (placeholder text: have it reviewed by a lawyer) |
| Brand colours and type scale | `frontend/tailwind.config.ts` |
| Blog posts | The admin panel. Seed posts live in `backend/database/seed/posts/*.md`. |

---

## Requirements

- **Node.js 20.19 or newer**
- **PHP 8.2 or newer** with these extensions: `pdo_sqlite` (or `pdo_mysql`), `fileinfo`, `mbstring`, `openssl`
- **Composer 2**

### Installing PHP on Windows

The winget PHP package currently points to a broken download. Install PHP by hand instead:

1. Download the latest **PHP 8.3 x64 Thread Safe** zip from <https://windows.php.net/download/>.
2. Unzip it to a folder, for example `C:\Users\<you>\tools\php-8.3`, and add that folder to your PATH.
3. In that folder, copy `php.ini-development` to `php.ini` and remove the leading `;` from:
   ```ini
   extension_dir = "ext"
   extension=curl
   extension=fileinfo
   extension=mbstring
   extension=openssl
   extension=pdo_sqlite
   extension=sqlite3
   extension=zip
   ```
4. Install Composer from <https://getcomposer.org/download/>.

On macOS: `brew install php composer`.

`npm run dev` looks for PHP in this order: the `PHP_BIN` environment variable, `php` on PATH, `%USERPROFILE%\tools\php-8.3\php.exe`, then `C:\xampp\php\php.exe`.

---

## Deploying

**Hostinger with GitHub: follow [DEPLOYMENT.md](DEPLOYMENT.md).** Each push to `main` builds the site and uploads it over FTP ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)).

Everything runs on one domain:

| URL | Served by |
|---|---|
| `https://yourdomain.com/` and every page | the built React site |
| `https://yourdomain.com/login-yenkoadmin` | the admin panel (part of the same build) |
| `https://yourdomain.com/api/...` | the PHP backend |
| `https://yourdomain.com/uploads/...` | uploaded images |

To deploy by hand to any Apache or LiteSpeed host, run **`npm run package`**. It creates:
- `deploy/public_html/`: upload this to the web root.
- `deploy/yenko-backend/`: upload this next to the web root.
- `deploy/README-DEPLOY.md`: step-by-step instructions.

On Nginx, serve `public_html` as the root, send `/api/` requests to `public_html/api/index.php`, and let every other unknown path fall back to `index.html`.

---

## Backend commands

Run these inside `backend/`. If `composer` isn't on your PATH, use `php path/to/composer.phar <command>`.

| Command | What it does |
|---|---|
| `composer migrate` | Creates any missing tables. Existing data is kept. |
| `composer migrate:fresh` | **Drops every table** and recreates them. |
| `composer seed` | Creates or updates the admin from `.env`. Adds the seed categories and posts that don't exist yet, and the default pricing if none is saved. |
| `composer serve` | Runs the API on its own on port 8000. `npm run dev` already does this. |

To reset to a fresh demo state: `composer migrate:fresh && composer seed`. **This deletes all your posts and pricing changes.**

---

## API reference

All responses are JSON. Lists return `{ data, meta: { page, perPage, total, totalPages } }` and single items return `{ data }`.
Errors return `{ error: { message, fields? } }` with a matching HTTP status (401, 403, 404, 409, 413, 415, 422, 429).

Requests that change data with a login cookie (`POST`, `PUT`, `DELETE`) must include the header `X-Requested-With: XMLHttpRequest`. This protects against CSRF.

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | – | Health check |
| GET | `/api/posts?page&perPage&category` | – | Published posts, newest first. `category` is a category slug. |
| GET | `/api/posts/{slug}` | – | One published post, including its markdown `body` |
| GET | `/api/categories` | – | Categories with `postCount` (published posts only) |
| GET | `/api/pricing` | – | The pricing configuration: `{ currency, tabs, addOns, paymentMethods }` |
| POST | `/api/contact` | – | `{ name, email, topic?, campus?, message }`. Limited to 5 per hour per IP. |
| POST | `/api/auth/login` | – | `{ email, password }` sets the `yenko_session` cookie. Limited to 5 failed attempts per 15 minutes. |
| POST | `/api/auth/logout` | cookie | Clears the cookie |
| GET | `/api/auth/me` | admin | The signed-in admin |
| GET | `/api/admin/posts?page&perPage&status&category&q` | admin | All posts, including drafts |
| GET | `/api/admin/posts/{id}` | admin | One post |
| POST | `/api/admin/posts` | admin | Create a post |
| PUT | `/api/admin/posts/{id}` | admin | Update a post. Fields you leave out keep their current values. |
| DELETE | `/api/admin/posts/{id}` | admin | Delete a post |
| GET | `/api/admin/categories` | admin | Categories with `postCount` (drafts included) |
| POST | `/api/admin/categories` | admin | `{ name, slug?, description? }` |
| PUT | `/api/admin/categories/{id}` | admin | Update a category |
| DELETE | `/api/admin/categories/{id}` | admin | Delete a category. Returns **409** if it still has posts. |
| GET | `/api/admin/pricing` | admin | Pricing with `meta: { updatedAt, isDefault }` |
| PUT | `/api/admin/pricing` | admin | `{ data: pricing }` replaces the whole configuration. Returns **422** with a message per problem. |
| POST | `/api/admin/pricing/reset` | admin | Restores the default pricing |
| POST | `/api/admin/uploads` | admin | multipart field `image`: JPG, PNG or WebP. Returns `{ url, width, height, size, mimeType }`. |
| GET | `/api/admin/contact-submissions?page&perPage&topic` | admin | Form submissions, newest first |

**Post fields:** `title`, `slug`, `excerpt`, `body` (markdown), `coverImage`, `status` (`draft` or `published`), `publishedAt` (ISO 8601; a future date schedules the post), `categoryId`.

**Price fields:** `amount` (`null` for custom), `customLabel`, `period`, `includedQuantity`, `includedUnit`, `includedPer`, `extraRate`, `extraUnit`, `note`. Units: `min`, `hour`, `km`, `ride`, `seat`, `delivery`, `day`, `week`, `month`.

**Contact topics:** `general`, `support`, `partnerships`, `careers`, `press`, `waitlist`.

---

## Environment variables

One `.env` file in the project root is shared by the backend and the website build. Only `VITE_*` values are ever sent to the browser. On the server, `.env` lives in `yenko-backend/`.

| Variable | Default | Purpose |
|---|---|---|
| `APP_ENV` | `development` | `production` forces Secure cookies and requires a real `JWT_SECRET` |
| `APP_DEBUG` | `true` | Show real error messages in 500 responses |
| `DB_DRIVER` | `sqlite` | `sqlite` or `mysql` |
| `DB_SQLITE_PATH` | `database/yenko.sqlite` | Relative to the backend folder |
| `DB_HOST` / `DB_PORT` / `DB_NAME` / `DB_USER` / `DB_PASSWORD` | – | MySQL connection |
| `JWT_SECRET` | – | At least 32 characters; signs session tokens |
| `JWT_TTL_MINUTES` | `480` | How long an admin session lasts |
| `COOKIE_SECURE` | `false` in dev | Send the session cookie over HTTPS only |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | – | The single admin account, applied by `composer seed` |
| `VITE_ADMIN_PATH` | `/login-yenkoadmin` | URL path of the admin panel |
| `UPLOAD_MAX_MB` | `5` | Maximum image upload size |
| `UPLOAD_PATH` | `public/uploads` | Where uploads are stored, relative to the backend folder. Leave it empty on the server: the deployed web root's `uploads/` is found automatically. |
| `CORS_ALLOWED_ORIGINS` | empty | Only needed if the website and API are on different domains |
| `TRUST_PROXY` | `false` | Use `X-Forwarded-For` for rate limiting behind a proxy |

### Using MySQL instead of SQLite

1. Create an empty database: `CREATE DATABASE yenko CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;` (on Hostinger: hPanel → Databases → MySQL Databases).
2. In `.env`, set `DB_DRIVER=mysql` and fill in the `DB_*` values.
3. Enable `extension=pdo_mysql` in `php.ini` (already enabled on Hostinger).
4. Run `composer migrate && composer seed`.

---

## Project structure

```
package.json          npm run setup / dev / build / package
.github/workflows/    deploy.yml: build and upload to Hostinger on every push to main
DEPLOYMENT.md         Hostinger + GitHub setup guide
scripts/              setup.mjs, dev.mjs, package.mjs
.env                  shared settings (never commit)

frontend/
  tailwind.config.ts  brand colours, type scale, radii
  public/             brand/ (logo, store badges), images/, favicon.svg, .htaccess
  src/
    App.tsx           every route
    config/site.ts    site name, logo settings, admin path
    content/          navigation, services, campuses, FAQs, safety, careers, legal text, media, credits
    components/
      layout/         Header (dropdown menus), MobileNav, Footer, CookiePreferences
      sections/       SuperAppHero, HowItWorksCarousel, ServiceGrid, PageHero, SplitFeature, FeatureGrid,
                      Steps, StatsBand, CtaBanner, PhoneMockup, CampusGrid, ContactForm, FaqExplorer…
      blog/           PostCard, CategoryTabs, Pagination, Markdown
      ui/             Button, Field, Accordion, Badge, Logo, StoreButtons, icons…
    pages/            one file per page, grouped like the navigation
    admin/            AdminApp (routes), AuthContext, layout, pages/ (PostEditor, PricingEditor…), components/
    lib/              API client, pricing helpers, types, formatting, hooks

backend/
  public/             index.php (API entry point), uploads/
  src/                routes.php, Http/, Auth/, Controllers/, Repositories/, Support/
  database/           schema.sqlite.sql, schema.mysql.sql, migrate.php, seed.php, seed/ (posts, covers, pricing.json)
```

Photo and icon credits are in [CREDITS.md](CREDITS.md) and on the `/credits` page.
