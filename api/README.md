# Game Center API

Backend API server for the Game Center application.

## Project Structure

```
api/
├── config/                  # Configuration files
│   ├── development.js       # Dev environment config
│   ├── production.js        # Production environment config
│   └── test.js              # Test environment config
├── src/
│   ├── controllers/         # Business logic for routes
│   ├── middleware/          # Express middleware
│   ├── models/              # Database models
│   ├── routes/              # Route definitions
│   │   └── api/             # API routes using Express Router
│   ├── services/            # External service integrations
│   └── utils/               # Utility functions
├── tests/
│   ├── integration/         # API integration tests
│   ├── unit/                # Unit tests
│   └── fixtures/            # Test data
├── server.js                # Entry point
└── package.json
```

## Development

### Prerequisites

- Node.js (v14+)
- MongoDB

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/game-center
SECRET_KEY=your_jwt_secret_key
NODE_ENV=development
```

### Running the API

To start the development server with hot reloading:

```bash
npm run dev
```

To build for production:

```bash
npm run build
npm start
```

## Testing

Run tests:

```bash
npm test
```

Run tests with watch mode:

```bash
npm run test:watch
```

Generate test coverage report:

```bash
npm run test:coverage
```

## API Documentation

API documentation is available at `/api-docs` when running in development mode.

## Best Practices

1. Keep controllers thin and focused on HTTP-specific logic
2. Move business logic to services
3. Use proper error handling with custom error classes
4. Write tests for all new features
5. Document all endpoints with JSDoc/Swagger comments
6. Follow the established project structure

## Contributing

1. Create a feature branch
2. Make your changes
3. Write tests for your changes
4. Ensure all tests pass
5. Submit a pull request 

## Vitest Migration

This project has been migrated from Jest to Vitest for testing. Here are the key changes:

### New Files
- `vitest.config.js` - Vitest configuration (replaces `jest.config.js`)
- `tests/vitest.setup.js` - Vitest setup file (replaces `tests/setup.js`)
- `tests/fixtures/db.vitest.js` - ES module version of the database test helpers
- `tests/vitest.sample.test.js` - Sample test to ensure Vitest setup works correctly

### Updated Files
- `package.json` - Updated dependencies and test scripts
- `eslint.config.js` - Updated to use Vitest ESLint plugin

### Running Tests
- `npm test` - Run tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

### Migration Notes
The project now uses ES modules syntax in the test files. When writing new tests or migrating existing ones, use:
- `import` instead of `require`
- Named exports instead of `module.exports`
- Vitest's mocking utilities (`vi`) instead of Jest's (`jest`)

All existing tests will be migrated in a future update. 