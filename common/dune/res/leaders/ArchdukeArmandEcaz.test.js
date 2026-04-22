const leader = require('./ArchdukeArmandEcaz.js')

describe('Archduke Armand Ecaz', () => {
  test('data', () => {
    expect(leader.name).toBe('Archduke Armand Ecaz')
    expect(leader.source).toBe('Rise of Ix')
    expect(leader.leaderAbility).toContain('Coordination')
  })
})
