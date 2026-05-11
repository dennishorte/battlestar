const t = require('../testutil')

describe('4-Player Combat Tie Scenarios', () => {

  test('4-player game creates with correct player count', () => {
    const game = t.fixture({ numPlayers: 4 })
    game.run()
    expect(game.players.all().length).toBe(4)
    // 4-player starts at 1 VP
    const dennis = game.players.byName('dennis')
    expect(dennis.vp).toBe(1)
  })
})
