const { connect, closeDatabase, clearDatabase } = require('./fixtures/db.js')

// Mock the version module
jest.mock('../src/version', () => '1.0')

// Setup MongoDB memory server before all tests
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test'
  process.env.SECRET_KEY = 'test-secret-key'

  // Connect to in-memory database
  await connect()
})

// Clear collections after each test
afterEach(async () => {
  await clearDatabase()

  // Reset all mocks after each test
  jest.clearAllMocks()
})

// Close connection and server after all tests
afterAll(async () => {
  await closeDatabase()
})
