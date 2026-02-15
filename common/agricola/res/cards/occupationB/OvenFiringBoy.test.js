const t = require('../../../testutil_v2.js')

describe('Oven Firing Boy', () => {
  // Card text: "Each time you use a wood accumulation space, you get an
  // additional 'Bake Bread' action."
  // Card is 1+ players.

  test('Forest triggers Bake Bread offer with baking improvement', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['oven-firing-boy-b108'],
        majorImprovements: ['fireplace-2'],
        grain: 2,
      },
    })
    game.run()

    t.choose(game, 'Forest')
    // Bake Bread prompt from Oven Firing Boy
    t.choose(game, 'Bake 2 grain')

    t.testBoard(game, {
      dennis: {
        wood: 3,   // from Forest
        food: 4,   // 2 grain × 2 food each (Fireplace)
        occupations: ['oven-firing-boy-b108'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })

  test('Forest without baking improvement does not offer bake', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['oven-firing-boy-b108'],
        grain: 2,
        // No baking improvement
      },
    })
    game.run()

    t.choose(game, 'Forest')
    // No bake prompt — no baking improvement

    t.testBoard(game, {
      dennis: {
        wood: 3,
        grain: 2,  // unchanged
        occupations: ['oven-firing-boy-b108'],
      },
    })
  })

  test('does not trigger on non-wood accumulation spaces', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['oven-firing-boy-b108'],
        majorImprovements: ['fireplace-2'],
        grain: 2,
      },
    })
    game.run()

    t.choose(game, 'Clay Pit')
    // No bake prompt — Clay Pit is not a wood accumulation space

    t.testBoard(game, {
      dennis: {
        clay: 1,
        grain: 2,  // unchanged
        occupations: ['oven-firing-boy-b108'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })
})
