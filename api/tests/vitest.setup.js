import { connect, closeDatabase, clearDatabase } from './fixtures/db.vitest.js';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

// Mock the version module
vi.mock('../src/version', () => '1.0');

// Setup MongoDB memory server before all tests
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  process.env.SECRET_KEY = 'test-secret-key';

  // Connect to in-memory database
  await connect();
});

// Clear collections after each test
afterEach(async () => {
  await clearDatabase();

  // Reset all mocks after each test
  vi.clearAllMocks();
});

// Close connection and server after all tests
afterAll(async () => {
  await closeDatabase();
}); 