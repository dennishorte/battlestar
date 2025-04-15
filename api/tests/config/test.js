describe('Test Configuration', () => {
  it('should have the correct test settings', () => {
    const testConfig = require('../../config/test')
    
    expect(testConfig.port).toBe(3001)
    expect(testConfig.logLevel).toBe('error')
    expect(testConfig.db.uri).toContain('game-center-test')
    expect(testConfig.jwt.secret).toBe('test-secret')
    expect(testConfig.jwt.expiresIn).toBe('1h')
  })
}) 
