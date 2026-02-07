const t = require('../../../testutil.js')

describe('Chick Stable (B044)', () => {
  test('schedules 2 food each for rounds +3 and +4', () => {
    const game = t.fixture({ cardSets: ['minorB'] })
    t.setBoard(game, {
      dennis: {
        wood: 1,
        hand: ['chick-stable-b044'],
      },
      round: 5,
    })
    game.run()

    game.state.round = 5
    t.playCard(game, 'dennis', 'chick-stable-b044')

    const dennis = t.player(game)
    expect(game.state.scheduledFood[dennis.name][8]).toBe(2)
    expect(game.state.scheduledFood[dennis.name][9]).toBe(2)
  })
})
