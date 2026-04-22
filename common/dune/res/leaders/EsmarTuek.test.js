const leader = require('./EsmarTuek.js')

describe('Esmar Tuek', () => {
  test('data', () => {
    expect(leader.name).toBe('Esmar Tuek')
    expect(leader.source).toBe('Bloodlines')
  })
})
