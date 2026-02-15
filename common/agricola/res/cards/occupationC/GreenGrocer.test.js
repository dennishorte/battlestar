const t = require('../../../testutil_v2.js')

describe('Green Grocer', () => {
  // Card text: "At the start of each round, you can make exactly one exchange."

  test('exchanges 1 grain for 2 food at round start', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['green-grocer-c103'],
        grain: 2,
        food: 0,
      },
    })
    game.run()

    // Round start: Green Grocer fires
    t.choose(game, 'Exchange 1 grain for 2 food')

    t.testBoard(game, {
      dennis: {
        occupations: ['green-grocer-c103'],
        grain: 1,
        food: 2,
      },
    })
  })

  test('exchanges 2 food for 1 grain', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['green-grocer-c103'],
        food: 3,
        grain: 0,
      },
    })
    game.run()

    t.choose(game, 'Exchange 2 food for 1 grain')

    t.testBoard(game, {
      dennis: {
        occupations: ['green-grocer-c103'],
        food: 1,
        grain: 1,
      },
    })
  })
})
