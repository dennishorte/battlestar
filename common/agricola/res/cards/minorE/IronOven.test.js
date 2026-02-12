const t = require('../../../testutil_v2.js')

describe('Iron Oven', () => {
  test('bake bread immediately when played', () => {
    const game = t.fixture({ cardSets: ['minorE', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['iron-oven-e063'],
        stone: 3,
        grain: 2,
      },
    })
    game.run()

    // Dennis plays Iron Oven via Meeting Place
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Iron Oven')
    // Iron Oven triggers bake: bakingRate 6, maxBakePerAction 1
    t.choose(game, 'Bake 1 grain')

    t.testBoard(game, {
      dennis: {
        food: 1 + 6,  // 1 (Meeting Place) + 6 (bake 1 grain at rate 6)
        grain: 1,      // 2 - 1 (baked) = 1
        minorImprovements: ['iron-oven-e063'],
      },
    })
  })
})
