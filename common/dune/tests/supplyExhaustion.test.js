const t = require('../testutil')
const { resolveEffect } = require('../phases/playerTurns.js')

describe('Supply Exhaustion', () => {

  test('cannot recruit troop if none in supply', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInSupply: 0, troopsInGarrison: 12 },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const garrisonBefore = dennis.troopsInGarrison

    // Try to recruit — should be capped at 0
    resolveEffect(game, dennis, { type: 'troop', amount: 1 }, null)

    // No change: cannot recruit from empty supply
    expect(dennis.troopsInGarrison).toBe(garrisonBefore)
    expect(dennis.troopsInSupply).toBe(0)
  })
})
