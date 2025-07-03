# Laravel React TypeScript Project

This is a full-stack web application built with Laravel, React, and TypeScript. The React frontend is integrated within the Laravel application using Vite.

## Features

- Laravel 10.x backend
- React 18.x frontend with TypeScript
- Vite for asset bundling
- Laravel Sanctum for authentication
- REST API architecture
- TypeScript for type safety

## Prerequisites

- PHP 8.1 or higher
- Node.js 16.0 or higher
- Composer
- MySQL or PostgreSQL

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install PHP dependencies:
```bash
composer install
```

3. Install Node.js dependencies:
```bash
npm install
```

4. Create environment file:
```bash
cp .env.example .env
```

5. Generate application key:
```bash
php artisan key:generate
```

6. Configure your database in the `.env` file:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

7. Run database migrations:
```bash
php artisan migrate
```

8. Start the development server:
```bash
# Terminal 1: Laravel server
php artisan serve

# Terminal 2: Vite development server
npm run dev
```

The application will be available at `http://localhost:8000`.

## Development

- Laravel backend code is in the `app` directory
- React frontend code is in the `resources/js` directory
- API routes are defined in `routes/api.php`
- Frontend routes are handled by React Router in `resources/js/router`

## API Endpoints

- `GET /api/hello`: Test endpoint that returns a welcome message
- `GET /api/user`: Returns the authenticated user (requires authentication)

## Authentication

This project uses Laravel Sanctum for API authentication. To authenticate:

1. Register a user through the API
2. Login to receive a token
3. Include the token in subsequent requests in the Authorization header

## Building for Production

To build the application for production:

```bash
npm run build
php artisan optimize
```

## Testing

```bash
# Run PHP tests
php artisan test

# Run JavaScript/TypeScript tests
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
