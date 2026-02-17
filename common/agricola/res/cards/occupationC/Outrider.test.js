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

    // Round 1: the most recently revealed round card is Grain Utilization (round 1).
    // Taking that action triggers Outrider — gets 1 grain
    t.choose(game, 'Grain Utilization')

    t.testBoard(game, {
      dennis: {
        food: 10,
        grain: 1,
        occupations: ['outrider-c160'],
      },
    })
  })
})
