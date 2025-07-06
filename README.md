# E-commerce using Laravel and react

A Laravel 12 + React (Vite & TypeScript) monorepo demo that powers a small e-commerce storefront and API.

---

## Table of contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Running the application](#running-the-application)
4. [Queues & scheduled jobs](#queues--scheduled-jobs)
5. [Media handling & image optimisation](#media-handling--image-optimisation)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

| Requirement | Minimum Version | Purpose |
|-------------|-----------------|---------|
| **PHP** | **8.3** | Application runtime |
| **Composer** | 2.5 | PHP dependency management |
| **Node.js** | 18 LTS | Front-end tooling (Vite) |
| **NPM** | 9 + | JavaScript dependency management |
| **MySQL / MariaDB** | 8 / 10.5 | Primary database |
| **Redis** | 6 + | Cache, sessions & queues |
| **Git** | — | Version control |

> ⚠️  Make sure both PHP and Node binaries are available in your `$PATH`.

---

## Installation

Follow the steps below **exactly**; most issues occur when a step is skipped.

1. **Clone the repository**

   ```bash
   git@github.com:ZED-Magdy/Laravel-React-Ecommerce-Example.git
   cd daftra-ecommerce
   ```

2. **Install PHP dependencies** (requires PHP ≥ 8.3)

   ```bash
   composer install --prefer-dist --ansi
   ```

   > We intentionally **do not** pass `--no-dev` because the development tool-chain (Pest, PHPStan, Rector, Pint …) lives in the `require-dev` section.

3. **Copy the example environment file & generate the application key**

   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Configure environment variables**

   Edit `.env` and fill in **at least** the following:

   ```dotenv
   # App
   APP_NAME="Daftra E-commerce"
   APP_URL="http://localhost:8000"

   # Database
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=daftra
   DB_USERNAME=root
   DB_PASSWORD=secret

   # Redis
   REDIS_HOST=127.0.0.1
   REDIS_PASSWORD=null
   REDIS_PORT=6379
   ```

5. **Install JS/TS dependencies**

   ```bash
   npm install
   ```

6. **Install image-optimisation binaries (recommended)**

   For optimal thumbnails & responsive images you should install the tools listed in the Spatie docs **before you run the application**:

   <https://spatie.be/docs/laravel-medialibrary/v11/installation-setup#content-setting-up-optimization-tools>

   On Ubuntu you can run, for example:

   ```bash
   sudo apt install jpegoptim optipng pngquant gifsicle libavif-bin
   sudo snap install svgo     # or npm install -g svgo
   ```

7. **Run database migrations _and_ seeders** (creates demo data)

   ```bash
   php artisan migrate --seed
   ```

8. **Create the storage symlink** (serves user-uploaded files)

   ```bash
   php artisan storage:link
   ```

9. **Start the development stack**

   This project defines a Composer script that wraps Vite and several artisan commands. Fire it up with:

   ```bash
   composer run dev
   ```

   The default credentials is:
   ```
   test@example.com
   password
   ```

   The script spawns **four** concurrent processes:

   | Name    | Command                                   | Purpose |
   |---------|-------------------------------------------|---------|
   | **server** | `php artisan serve`                     | Serves the Laravel HTTP API & SPA on <http://localhost:8000> |
   | **queue**  | `php artisan queue:work --tries=1`      | Executes queued jobs such as media conversions |
   | **logs**   | `php artisan pail --timeout=0`          | Real-time log viewer in the terminal |
   | **vite**   | `npm run dev`                           | React/Vite dev server with HMR – proxied through Laravel |

Installation is complete. Open **<http://localhost:8000>** in your browser.  
Interactive API documentation is available at **<http://localhost:8000/docs.html>**.

---

## Running the application

The easiest way to spin up **everything** in development is:

```bash
composer run dev
```

This invokes the `dev` script defined in **composer.json** which leverages [concurrently](https://github.com/open-cli-tools/concurrently) to run **four** processes side-by-side with pretty-coloured labels:

| Name    | Command                                      | Purpose |
|---------|----------------------------------------------|---------|
| **server** | `php artisan serve`                        | Serves the Laravel HTTP API on <http://localhost:8000> |
| **queue**  | `php artisan queue:listen --tries=1`       | Executes queued jobs such as media conversions |
| **logs**   | `php artisan pail --timeout=0`             | Real-time log viewer in the terminal |
| **vite**   | `npm run dev`                              | React/Vite dev server with HMR on <http://localhost:5173> |

If you prefer, you can run each command individually in separate terminals.

### Queue worker in production

The `composer run dev` script already starts a queue listener in development.  
In staging / production environments run:

```bash
php artisan queue:work --tries=3 --daemon
```

supervised by a process manager such as **systemd**, **supervisord** or **PM2**.

---

## Media handling & image optimisation

This project uses **[spatie/laravel-medialibrary](https://github.com/spatie/laravel-medialibrary)** for storing and converting user-uploaded files. For optimum image compression you must install several binaries **on your local machine or CI runner**.

The Medialibrary docs list the required tools and installation commands for Ubuntu, macOS and Windows. Follow the guide here 👉  <https://spatie.be/docs/laravel-medialibrary/v11/installation-setup#content-setting-up-optimization-tools>.

**Minimum recommended tools:** `jpegoptim` · `optipng` · `pngquant` · `gifsicle` · `svgo` · `libavif`.

If the optimisers are missing Medialibrary will still work, but generated images will be larger.

---

## Static analysis & code quality

| Tool | Command | Notes |
|------|---------|-------|
| **Laravel Pint** | `./vendor/bin/pint` | Opinionated code-style fixer |
| **Larastan (PHPStan)** | `./vendor/bin/phpstan analyse` | Static analysis – level is configured in `phpstan.neon` |
| **Rector** | `./vendor/bin/rector` | Automated refactoring & upgrades |

All tools are installed through Composer so no global installation is required.

---

## Testing

This project uses **Pest** (with PHPUnit under the hood) for unit & feature tests.

Run the entire test suite:

```bash
./vendor/bin/pest
```

You can filter tests by directory, file or name using Pest flags – see the [Pest documentation](https://pestphp.com/docs/filters).

---

For additional help open an issue or start a discussion.
