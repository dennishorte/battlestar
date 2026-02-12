const t = require('../../../testutil_v2.js')

describe('Remodeling', () => {
  test('gives 1 clay per clay room and per major improvement', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['remodeling-c005'],
        food: 1,
        roomType: 'clay',
        majorImprovements: ['fireplace-2'],
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Remodeling')

    // 2 clay rooms + 1 major improvement = 3 clay
    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        clay: 3,
        food: 1, // 1 food start, +1 Meeting Place, -1 card cost
        roomType: 'clay',
        majorImprovements: ['fireplace-2'],
        minorImprovements: ['remodeling-c005'],
      },
    })
  })

  test('gives nothing with wood rooms and no major improvements', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['remodeling-c005'],
        food: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Remodeling')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        clay: 0,
        food: 1, // 1 food start, +1 Meeting Place, -1 card cost
        minorImprovements: ['remodeling-c005'],
      },
    })
  })
})
