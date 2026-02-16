const t = require('../../../testutil_v2.js')

describe('Flax Farmer', () => {
  test('gives 1 grain when using Reed Bank', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['flax-farmer-e137'],
        grain: 0,
      },
    })
    game.run()

    t.choose(game, 'Reed Bank') // triggers Flax Farmer → +1 grain

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        reed: 1,  // Reed Bank accumulates 1 (1 round of accumulation)
        grain: 1, // from Flax Farmer
        occupations: ['flax-farmer-e137'],
      },
    })
  })

  test('gives 1 reed when using Grain Seeds', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['flax-farmer-e137'],
        reed: 0,
      },
    })
    game.run()

    t.choose(game, 'Grain Seeds') // triggers Flax Farmer → +1 reed

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        grain: 1, // from Grain Seeds
        reed: 1,  // from Flax Farmer
        occupations: ['flax-farmer-e137'],
      },
    })
  })
})
