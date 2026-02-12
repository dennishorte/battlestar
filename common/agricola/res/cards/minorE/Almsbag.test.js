const t = require('../../../testutil_v2.js')

describe('Almsbag', () => {
  test('gives 1 grain per 2 completed rounds', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 7,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['almsbag-e065'],
      },
    })
    game.run()

    // Round 7: 6 completed rounds → 3 grain
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Almsbag')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        grain: 3,
        food: 1, // Meeting Place gives 1 food
        minorImprovements: ['almsbag-e065'],
      },
    })
  })

  test('gives nothing in round 1 (0 completed rounds)', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['almsbag-e065'],
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Almsbag')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        grain: 0,
        food: 1, // Meeting Place gives 1 food
        minorImprovements: ['almsbag-e065'],
      },
    })
  })
})
