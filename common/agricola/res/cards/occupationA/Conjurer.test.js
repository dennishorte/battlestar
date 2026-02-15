const t = require('../../../testutil_v2.js')

describe('Conjurer', () => {
  test('onAction gives 1 wood and 1 grain when using Traveling Players', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['conjurer-a155'],
        food: 5,
      },
      micah: { food: 5 },
      scott: { food: 5 },
      eliya: { food: 5 },
    })
    game.run()

    t.choose(game, 'Traveling Players')

    t.testBoard(game, {
      dennis: {
        occupations: ['conjurer-a155'],
        wood: 1,
        grain: 1,
        food: 6, // 5 + 1 from Traveling Players accumulation
      },
    })
  })

  test('does not trigger for other actions', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['conjurer-a155'],
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        occupations: ['conjurer-a155'],
        wood: 0,
        grain: 0,
        food: 2,
      },
    })
  })
})
