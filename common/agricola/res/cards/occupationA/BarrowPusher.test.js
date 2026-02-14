const t = require('../../../testutil_v2.js')

describe('Barrow Pusher', () => {
  test('onPlowField grants 1 clay and 1 food when plowing a new field', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Farmland'],
      dennis: {
        occupations: ['barrow-pusher-a105'],
        clay: 0,
        food: 0,
      },
    })
    game.run()

    t.choose(game, 'Farmland')
    t.choose(game, '2,0')

    t.testBoard(game, {
      dennis: {
        occupations: ['barrow-pusher-a105'],
        clay: 1,
        food: 1,
        farmyard: {
          fields: [{ row: 2, col: 0 }],
        },
      },
    })
  })

  test('onPlowField grants 1 clay and 1 food per field when plowing multiple fields', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'minorE', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Farmland'],
      dennis: {
        occupations: ['barrow-pusher-a105', 'test-occupation-1'],
        minorImprovements: ['skimmer-plow-e017'],
        clay: 0,
        food: 0,
      },
    })
    game.run()

    t.choose(game, 'Farmland')
    t.choose(game, '2,0')
    t.choose(game, '2,1')

    t.testBoard(game, {
      dennis: {
        occupations: ['barrow-pusher-a105', 'test-occupation-1'],
        minorImprovements: ['skimmer-plow-e017'],
        clay: 2,
        food: 2,
        farmyard: {
          fields: [{ row: 2, col: 0 }, { row: 2, col: 1 }],
        },
      },
    })
  })

  test('onPlowField does not trigger when not plowing', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['barrow-pusher-a105'],
        clay: 0,
        food: 0,
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        occupations: ['barrow-pusher-a105'],
        food: 2,
        clay: 0,
      },
    })
  })
})
