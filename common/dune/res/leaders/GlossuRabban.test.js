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
    const supplyBefore = dennis.troopsInSupply
    const garrisonBefore = dennis.troopsInGarrison
    leader.resolveSignetRing(game, dennis)
    const after = game.players.byName('dennis')
    expect(after.troopsInSupply).toBe(supplyBefore - 1)
    expect(after.troopsInGarrison).toBe(garrisonBefore + 1)
  })

  test('Brutality: +3 Troops total with an alliance', () => {
    const game = t.fixture()
    t.setBoard(game, {
      leaders: { dennis: leader },
      alliances: { fremen: 'dennis' },
    })
    game.run()
    const dennis = game.players.byName('dennis')
    const supplyBefore = dennis.troopsInSupply
    const garrisonBefore = dennis.troopsInGarrison
    leader.resolveSignetRing(game, dennis)
    const after = game.players.byName('dennis')
    expect(after.troopsInSupply).toBe(supplyBefore - 3)
    expect(after.troopsInGarrison).toBe(garrisonBefore + 3)
  })
})
