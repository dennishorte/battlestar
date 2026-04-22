const leader = require('./IlesaEcaz.js')

describe('Ilesa Ecaz', () => {
  test('data', () => {
    expect(leader.name).toBe('Ilesa Ecaz')
    expect(leader.source).toBe('Rise of Ix')
    expect(leader.leaderAbility).toContain('One Step Ahead')
  })
})
