const t = require('../testutil')

describe('Strength Requires Units', () => {

  test('swords alone with no units in conflict produce 0 strength', () => {
    const game = t.fixture()
    game.run()

    // Dennis plays Dagger (green) to Assembly Hall (non-combat, green space)
    t.choose(game, 'Agent Turn')
    t.choose(game, 'Dagger')
    t.choose(game, 'Assembly Hall')

    // Micah reveals
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Pass')

    // Dennis reveals — remaining hand includes another Dagger (1 sword)
    // but no troops in conflict, so strength should be 0
    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    expect(dennis.strength).toBe(0)
  })

  test('swords contribute to strength when units are present', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 3 },
    })
    game.run()

    // Dennis sends agent to combat space, deploys 1 troop
    t.choose(game, 'Agent Turn')
    t.choose(game, 'Reconnaissance')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Deploy 1 troop(s) from garrison')

    // Micah reveals
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Pass')

    // Dennis reveals — should have strength from troops + swords
    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    // Troops in conflict provide base strength, swords add to it
    expect(dennis.strength).toBeGreaterThanOrEqual(2)
  })
})
