describe('Config Module', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('should use the configuration based on NODE_ENV', () => {
    // Set NODE_ENV to test
    process.env.NODE_ENV = 'test'
    const testConfig = require('../../config')
    
    // Should use test configuration
    expect(testConfig.port).toBe(3001)
    expect(testConfig.logLevel).toBe('error')
    
    // Reset and try with development
    jest.resetModules()
    process.env.NODE_ENV = 'development'
    const devConfig = require('../../config')
    
    // Should use development configuration
    expect(devConfig.logLevel).toBe('debug')
    
    // Reset and try with production
    jest.resetModules()
    process.env.NODE_ENV = 'production'
    const prodConfig = require('../../config')
    
    // Should use production configuration
    expect(prodConfig.logLevel).toBe('info')
  })

  it('should default to development environment when NODE_ENV is not set', () => {
    // Unset NODE_ENV
    delete process.env.NODE_ENV
    
    const config = require('../../config')
    
    // Should use development configuration
    expect(config.logLevel).toBe('debug')
  })
}) 
