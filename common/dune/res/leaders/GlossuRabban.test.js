const t = require('../../testutil.js')
const leader = require('./GlossuRabban.js')

describe('Glossu "The Beast" Rabban', () => {
  test('data', () => {
    expect(leader.name).toContain('Rabban')
    expect(leader.leaderAbility).toContain('Arrakis Fiefdom')
  })

  test('Arrakis Fiefdom grants +1 Spice and +1 Solari at setup', () => {
    const game = t.fixture()
    t.setBoard(game, { leaders: { dennis: leader } })
    game.run()
    const dennis = game.players.byName('dennis')
    expect(dennis.spice).toBe(1)
    expect(dennis.solari).toBe(1)
  })
})
