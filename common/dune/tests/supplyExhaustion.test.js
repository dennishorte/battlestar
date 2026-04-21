const t = require('../testutil')

describe('Supply Exhaustion', () => {

  test('cannot recruit troop if none in supply', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInSupply: 0, troopsInGarrison: 12 },
    })
    game.run()

    // Dennis visits Arrakeen which gives +1 troop — but supply is empty
    t.choose(game, 'Agent Turn.Reconnaissance')
    t.choose(game, 'Arrakeen')

    // After space effects, garrison and supply should be unchanged for troop recruitment
    const updatedDennis = game.players.byName('dennis')
    expect(updatedDennis.troopsInSupply).toBe(0)
  })
})
