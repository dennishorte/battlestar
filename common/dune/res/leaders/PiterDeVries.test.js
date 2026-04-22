const leader = require('./PiterDeVries.js')

describe('Piter de Vries', () => {
  test('data', () => {
    expect(leader.name).toBe('Piter de Vries')
    expect(leader.source).toBe('Bloodlines')
  })
})
