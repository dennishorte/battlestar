const t = require('../../../testutil_v2.js')

describe('Oriental Fireplace', () => {
  test('baking: converts grain to 2 food via Grain Utilization', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['oriental-fireplace-a060'],
        grain: 2,
      },
      actionSpaces: ['Grain Utilization', 'Day Laborer', 'Forest'],
    })
    game.run()

    // Dennis takes Grain Utilization (no fields so skip sow, goes to bake)
    t.choose(game, 'Grain Utilization')
    t.choose(game, 'Bake 1 grain')

    t.testBoard(game, {
      dennis: {
        grain: 1, // 2 - 1 baked
        food: 2, // 1 grain → 2 food via Oriental Fireplace
        minorImprovements: ['oriental-fireplace-a060'],
      },
    })
  })

  test('anytime conversion: vegetable to 4 food during harvest feeding', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 3, // plays round 4 (first harvest)
      dennis: {
        minorImprovements: ['oriental-fireplace-a060'],
        vegetables: 1,
      },
      micah: {
        food: 4, // enough to feed micah without conversion
      },
    })
    game.run()

    // Round 4: 4 actions (dennis, micah, dennis, micah)
    t.choose(game, 'Day Laborer') // dennis: +2 food → 2 food
    t.choose(game, 'Forest') // micah
    t.choose(game, 'Grain Seeds') // dennis: +1 grain
    t.choose(game, 'Clay Pit') // micah

    // Harvest feeding: dennis needs 4 food (2 family × 2), has 2
    // Convert vegetable → 4 food via Oriental Fireplace
    t.choose(game, 'Oriental Fireplace: vegetables \u2192 4 food')

    t.testBoard(game, {
      dennis: {
        food: 2, // 0 + 2(DL) + 4(conversion) - 4(feeding)
        grain: 1,
        vegetables: 0,
        minorImprovements: ['oriental-fireplace-a060'],
      },
    })
  })
})
