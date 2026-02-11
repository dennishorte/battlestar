const t = require('../../../testutil_v2.js')

describe('Mining Hammer', () => {
  test('gives 1 food on play', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['mining-hammer-b016'],
        wood: 1, // card cost
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Mining Hammer')

    t.testBoard(game, {
      dennis: {
        food: 2, // 1 from Meeting Place + 1 from Mining Hammer
        minorImprovements: ['mining-hammer-b016'],
      },
    })
  })

  test('offers free stable when renovating', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['mining-hammer-b016'],
        clay: 2, // renovation cost: 1 clay per room (2 rooms) + 1 reed
        reed: 1,
      },
      actionSpaces: ['House Redevelopment'],
    })
    game.run()

    t.choose(game, 'House Redevelopment')
    // Mining Hammer offers a free stable
    t.choose(game, '1,1')

    t.testBoard(game, {
      dennis: {
        roomType: 'clay',
        minorImprovements: ['mining-hammer-b016'],
        farmyard: {
          stables: [{ row: 1, col: 1 }],
        },
      },
    })
  })

  test('can skip the free stable', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['mining-hammer-b016'],
        clay: 2, // renovation cost: 1 clay per room (2 rooms) + 1 reed
        reed: 1,
      },
      actionSpaces: ['House Redevelopment'],
    })
    game.run()

    t.choose(game, 'House Redevelopment')
    // Mining Hammer offers a free stable — skip it
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        roomType: 'clay',
        minorImprovements: ['mining-hammer-b016'],
      },
    })
  })
})
