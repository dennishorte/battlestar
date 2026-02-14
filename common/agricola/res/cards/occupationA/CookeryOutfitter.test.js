const t = require('../../../testutil_v2.js')

describe('Cookery Outfitter', () => {
  test('getEndGamePoints: 0 VP with no cooking improvement', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['cookery-outfitter-a101'],
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        occupations: ['cookery-outfitter-a101'],
        score: -14,
      },
    })
  })

  test('getEndGamePoints: +1 VP per cooking improvement', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['cookery-outfitter-a101'],
        majorImprovements: ['fireplace-2'],
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        occupations: ['cookery-outfitter-a101'],
        score: -12,
        majorImprovements: ['fireplace-2'],
      },
    })
  })

  test('getEndGamePoints: +2 VP for two cooking improvements', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['cookery-outfitter-a101'],
        majorImprovements: ['fireplace-2', 'fireplace-3'],
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        occupations: ['cookery-outfitter-a101'],
        score: -10,
        majorImprovements: ['fireplace-2', 'fireplace-3'],
      },
    })
  })
})
