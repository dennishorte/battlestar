const leader = require('./PrinceRhomburVernius.js')

describe('Prince Rhombur Vernius', () => {
  test('data', () => {
    expect(leader.name).toBe('Prince Rhombur Vernius')
    expect(leader.source).toBe('Rise of Ix')
  })
})
