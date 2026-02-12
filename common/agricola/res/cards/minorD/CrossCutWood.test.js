const t = require('../../../testutil_v2.js')

describe('Cross-Cut Wood', () => {
  test('gives wood equal to stone in supply on play', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['cross-cut-wood-d004'],
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        food: 1,
        stone: 3,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Cross-Cut Wood')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        stone: 3,
        wood: 3,
        food: 1, // Meeting Place gives 1 food
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['cross-cut-wood-d004'],
      },
    })
  })

  test('gives nothing with no stone', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['cross-cut-wood-d004'],
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        food: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Cross-Cut Wood')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 0,
        food: 1, // Meeting Place gives 1 food
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['cross-cut-wood-d004'],
      },
    })
  })
})
