const t = require('../../../testutil_v2.js')

describe('Bread Paddle', () => {
  test('gives 1 food on play', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['bread-paddle-b025'],
        wood: 1, // card cost
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Bread Paddle')

    t.testBoard(game, {
      dennis: {
        food: 2, // 1 from Meeting Place + 1 from Bread Paddle
        minorImprovements: ['bread-paddle-b025'],
      },
    })
  })

  test('triggers bake bread when playing an occupation with baking ability', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['bread-paddle-b025'],
        majorImprovements: ['fireplace-2'],
        hand: ['test-occupation-1'],
        grain: 2,
      },
    })
    game.run()

    // Play an occupation to trigger onPlayOccupation
    t.choose(game, 'Lessons A')
    t.choose(game, 'Test Occupation 1')
    // Bread Paddle triggers bakeBread — choose to bake 1 grain
    t.choose(game, 'Bake 1 grain')

    t.testBoard(game, {
      dennis: {
        grain: 1, // 2 - 1 baked
        food: 2, // fireplace-2 converts 1 grain → 2 food
        occupations: ['test-occupation-1'],
        minorImprovements: ['bread-paddle-b025'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })
})
