const t = require('../../../testutil_v2.js')

describe('Junk Room', () => {
  test('gives 1 food on play via Meeting Place', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['junk-room-a055'],
        wood: 1, clay: 1, // cost of Junk Room
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Junk Room')

    t.testBoard(game, {
      dennis: {
        food: 2, // +1 from Meeting Place + 1 from onBuildImprovement
        hand: [],
        minorImprovements: ['junk-room-a055'],
      },
    })
  })

  test('onBuildImprovement gives 1 food when building another improvement', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['test-minor-1'],
        minorImprovements: ['junk-room-a055'],
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Test Minor 1')

    t.testBoard(game, {
      dennis: {
        food: 2, // +1 from Meeting Place + 1 from Junk Room onBuildImprovement
        hand: [],
        minorImprovements: ['junk-room-a055', 'test-minor-1'],
      },
    })
  })
})
