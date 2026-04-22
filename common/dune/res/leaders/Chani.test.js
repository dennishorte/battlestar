const leader = require('./Chani.js')

describe('Chani', () => {
  test('data', () => {
    expect(leader.name).toBe('Chani')
    expect(leader.source).toBe('Bloodlines')
  })
})
