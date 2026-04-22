const leader = require('./CountHasimirFenring.js')

describe('Count Hasimir Fenring', () => {
  test('data', () => {
    expect(leader.name).toBe('Count Hasimir Fenring')
    expect(leader.source).toBe('Bloodlines')
  })
})
