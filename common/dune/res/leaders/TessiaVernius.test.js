const leader = require('./TessiaVernius.js')

describe('Tessia Vernius', () => {
  test('data', () => {
    expect(leader.name).toBe('Tessia Vernius')
    expect(leader.source).toBe('Rise of Ix')
  })
})
