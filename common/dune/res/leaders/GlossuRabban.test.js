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

  test('Brutality: +1 Troop without an alliance', () => {
    const game = t.fixture()
    t.setBoard(game, { leaders: { dennis: leader } })
    game.run()
    const dennis = game.players.byName('dennis')
    const before = dennis.troopsInSupply
    leader.resolveSignetRing(game, dennis)
    expect(game.players.byName('dennis').troopsInSupply).toBe(before + 1)
  })

  test('Brutality: +3 Troops total with an alliance', () => {
    const game = t.fixture()
    t.setBoard(game, {
      leaders: { dennis: leader },
      alliances: { fremen: 'dennis' },
    })
    game.run()
    const dennis = game.players.byName('dennis')
    const before = dennis.troopsInSupply
    leader.resolveSignetRing(game, dennis)
    expect(game.players.byName('dennis').troopsInSupply).toBe(before + 3)
  })
})
