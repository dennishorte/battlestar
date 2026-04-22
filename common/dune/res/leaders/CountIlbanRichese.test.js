const leader = require('./CountIlbanRichese.js')

describe('Count Ilban Richese', () => {
  test('data', () => {
    expect(leader.name).toBe('Count Ilban Richese')
    expect(leader.leaderAbility).toContain('Ruthless Negotiator')
  })
})
