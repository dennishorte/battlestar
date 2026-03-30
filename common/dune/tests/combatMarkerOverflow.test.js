const t = require('../testutil')
const constants = require('../res/constants')

describe('Combat Marker Overflow', () => {

  test('strength counter supports values over 20', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')

    // Simulate high strength: 11 troops (22 strength) + swords
    game.state.conflict.deployedTroops.dennis = 11
    const strength = 11 * constants.TROOP_STRENGTH
    dennis.setCounter('strength', strength, { silent: true })

    expect(dennis.strength).toBe(22)
    expect(dennis.strength).toBeGreaterThan(20)
  })

  test('strength calculation does not cap at 20', () => {
    // The game engine stores raw strength; the +20 flip is UI-only
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')
    game.state.conflict.deployedTroops.dennis = 8
    game.state.conflict.deployedSandworms.dennis = 3

    const expected = 8 * constants.TROOP_STRENGTH + 3 * constants.SANDWORM_STRENGTH
    expect(expected).toBe(25) // 16 + 9

    dennis.setCounter('strength', expected, { silent: true })
    expect(dennis.strength).toBe(25)
  })
})
