const t = require('../../../testutil_v2.js')

describe('Outrider', () => {
  test('gives grain on most recently revealed action space', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['outrider-c160'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // Round 2: the most recently revealed round card is the one just revealed.
    // Take that action — should get 1 grain from Outrider
    t.choose(game, 'Grain Utilization')

    t.testBoard(game, {
      dennis: {
        food: 10,
        occupations: ['outrider-c160'],
      },
    })
  })
})
