const t = require('../../../testutil_v2.js')

describe('Baker', () => {
  // Card text: "When you play this card and at the start of each feeding phase,
  // you can take a 'Bake Bread' action."

  test('onPlay bakes bread if player has baking ability and grain', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['baker-c107'],
        majorImprovements: ['fireplace-2'],  // Fireplace: 1 grain → 2 food
        grain: 2,
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // Play Baker — should offer bake bread since we have Fireplace and grain
    t.choose(game, 'Lessons A')
    t.choose(game, 'Baker')
    // Bake bread: "Bake 1 grain" bakes 1 grain → 2 food via Fireplace
    t.choose(game, 'Bake 1 grain')

    t.testBoard(game, {
      dennis: {
        food: 12,  // 10 + 2 from baking
        grain: 1,  // 2 - 1 baked
        occupations: ['baker-c107'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })
})
