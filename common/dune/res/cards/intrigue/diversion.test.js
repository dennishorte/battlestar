'use strict'

const t = require('../../../testutil.js')
const card = require('./diversion.js')

describe("diversion", () => {
  test('data', () => {
    expect(card.id).toBe("diversion")
    expect(card.name).toBe("Diversion")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })

  test('plot: 3 troops + 1 sandworm (4 units) triggers Diversion', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      shieldWall: true,
      dennis: {
        intrigue: ['Diversion', 'Detonation', 'Unexpected Allies'],
        troopsInGarrison: 5,
        water: 2,
      },
    })
    game.run()

    t.choose(game, 'Diversion')
    t.choose(game, 'Detonation')
    t.choose(game, 'Deploy up to 4 Troops to Conflict')
    t.choose(game, 'Deploy 3')

    expect(game.state.turnTracking.diversionFired).toBeFalsy()
    expect(game.state.turnTracking.unitsDeployedThisTurn).toBe(3)

    t.choose(game, 'Unexpected Allies')
    t.choose(game, 'Pay 2 Water: Blow Shield Wall + 1 Sandworm')

    expect(game.state.turnTracking.unitsDeployedThisTurn).toBe(4)
    expect(game.state.turnTracking.diversionFired).toBe(true)
    expect(game.state.conflict.deployedSandworms.dennis).toBe(1)
  })

  test('plot: 3 troops alone does not trigger Diversion', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      shieldWall: false,
      dennis: {
        intrigue: ['Diversion', 'Detonation'],
        troopsInGarrison: 5,
      },
    })
    game.run()

    t.choose(game, 'Diversion')
    t.choose(game, 'Detonation')
    t.choose(game, 'Deploy up to 4 Troops to Conflict')
    t.choose(game, 'Deploy 3')

    expect(game.state.turnTracking.unitsDeployedThisTurn).toBe(3)
    expect(game.state.turnTracking.diversionFired).toBeFalsy()
  })
})
