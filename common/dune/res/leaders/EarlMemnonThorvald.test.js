const leader = require('./EarlMemnonThorvald.js')

describe('Earl Memnon Thorvald', () => {
  test('data', () => {
    expect(leader.name).toBe('Earl Memnon Thorvald')
    expect(leader.leaderAbility).toContain('Connections')
  })
})
