const t = require('../../../testutil_v2.js')

describe('Baking Sheet', () => {
  test('exchanges 1 grain for 2 food and 1 bonus point when baking', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Grain Utilization'],
      dennis: {
        minorImprovements: ['baking-sheet-a030'],
        majorImprovements: ['fireplace-2'],
        grain: 3,
      },
    })
    game.run()

    // Dennis takes Grain Utilization → no fields so skip sow → bake bread
    t.choose(game, 'Grain Utilization')
    t.choose(game, 'Bake 1 grain')
    // onBake fires → Baking Sheet offers exchange
    t.choose(game, 'Exchange 1 grain for 2 food and 1 bonus point')

    t.testBoard(game, {
      dennis: {
        grain: 1, // 3 - 1 baked - 1 Baking Sheet
        food: 4, // 2 from baking + 2 from Baking Sheet
        bonusPoints: 1,
        minorImprovements: ['baking-sheet-a030'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })

  test('can skip the baking sheet exchange', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Grain Utilization'],
      dennis: {
        minorImprovements: ['baking-sheet-a030'],
        majorImprovements: ['fireplace-2'],
        grain: 3,
      },
    })
    game.run()

    t.choose(game, 'Grain Utilization')
    t.choose(game, 'Bake 1 grain')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        grain: 2, // 3 - 1 baked
        food: 2, // 2 from baking
        minorImprovements: ['baking-sheet-a030'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })
})
