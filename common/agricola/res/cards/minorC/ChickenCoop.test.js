const t = require('../../../testutil.js')

describe('Chicken Coop (C044)', () => {
  test('schedules food for next 8 rounds', () => {
    const game = t.fixture({ cardSets: ['minorC'] })
    t.setBoard(game, {
      dennis: {
        wood: 2,
        reed: 1,
        hand: ['chicken-coop-c044'],
      },
      round: 3,
    })
    game.run()

    game.state.round = 3
    t.playCard(game, 'dennis', 'chicken-coop-c044')

    const dennis = t.player(game)
    // Should schedule food for rounds 4-11
    for (let r = 4; r <= 11; r++) {
      expect(game.state.scheduledFood[dennis.name][r]).toBe(1)
    }
  })
})
