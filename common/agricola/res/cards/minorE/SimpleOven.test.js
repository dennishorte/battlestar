const t = require('../../../testutil_v2.js')

describe('Simple Oven', () => {
  test('bake bread immediately when played', () => {
    const game = t.fixture({ cardSets: ['minorE', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['simple-oven-e064'],
        clay: 2,
        grain: 2,
      },
    })
    game.run()

    // Dennis plays Simple Oven via Meeting Place
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Simple Oven')
    // Simple Oven triggers bake: bakingRate 3, maxBakePerAction 1
    t.choose(game, 'Bake 1 grain')

    t.testBoard(game, {
      dennis: {
        food: 1 + 3,  // 1 (Meeting Place) + 3 (bake 1 grain at rate 3)
        grain: 1,      // 2 - 1 (baked) = 1
        minorImprovements: ['simple-oven-e064'],
      },
    })
  })
})
