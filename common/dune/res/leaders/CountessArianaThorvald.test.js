const leader = require('./CountessArianaThorvald.js')

describe('Countess Ariana Thorvald', () => {
  test('data', () => {
    expect(leader.name).toBe('Countess Ariana Thorvald')
    expect(leader.leaderAbility).toContain('Spice Addict')
  })
})
