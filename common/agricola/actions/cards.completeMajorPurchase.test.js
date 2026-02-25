const t = require('../testutil_v2.js')

describe('_completeMajorPurchase', () => {
  test('standard purchase: pays cost, moves card, fires onBuy hook', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        clay: 3,
        stone: 1,
        grain: 2,
        food: 0,
      },
      actionSpaces: ['Major Improvement'],
    })
    game.run()

    // Buy Clay Oven via the normal Major Improvement action
    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Clay Oven (clay-oven)')
    // onBuy fires: bake bread prompt
    t.choose(game, 'Bake 1 grain')

    t.testBoard(game, {
      dennis: {
        clay: 0,
        stone: 0,
        grain: 1,
        food: 5,
        majorImprovements: ['clay-oven'],
      },
    })
  })

  test('upgrade flow: free cost, fires onUpgradeFireplace', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        majorImprovements: ['fireplace-2'],
        clay: 4,
        stone: 1,
      },
      actionSpaces: ['Major Improvement'],
    })
    game.run()

    // Buy Cooking Hearth which upgrades from fireplace (free)
    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Cooking Hearth (cooking-hearth-4)')

    t.testBoard(game, {
      dennis: {
        // Resources unchanged — upgrade is free
        clay: 4,
        stone: 1,
        majorImprovements: ['cooking-hearth-4'],
      },
    })
  })

  test('custom cost: uses provided cost, not standard cost', () => {
    // OvenSite builds ovens for { clay: 1, stone: 1 } instead of standard cost
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['oven-site-a027'],
        majorImprovements: ['fireplace-2'],
        clay: 1,
        stone: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Oven Site')
    t.choose(game, 'Build Clay Oven')

    t.testBoard(game, {
      dennis: {
        food: 1, // +1 from Meeting Place
        clay: 0,
        stone: 0,
        wood: 2,
        minorImprovements: ['oven-site-a027'],
        majorImprovements: ['fireplace-2', 'clay-oven'],
      },
    })
  })

  test('custom cost: returns false if player cannot afford', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['basket-weaver-c095'],
        stone: 0,
        reed: 1,
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Basket Weaver')

    t.testBoard(game, {
      dennis: {
        stone: 0,
        reed: 1,
        food: 10,
        occupations: ['basket-weaver-c095'],
        majorImprovements: [],
      },
    })
  })

  test('custom cost: returns false if improvement not available', () => {
    // Give basketmakers-workshop to micah so it's not available
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['basket-weaver-c095'],
        stone: 2,
        reed: 2,
        food: 10,
      },
      micah: {
        food: 10,
        majorImprovements: ['basketmakers-workshop'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Basket Weaver')

    t.testBoard(game, {
      dennis: {
        stone: 2,
        reed: 2,
        food: 10,
        occupations: ['basket-weaver-c095'],
        majorImprovements: [],
      },
    })
  })

  test('onBuildImprovement hooks fire on major purchase', () => {
    // BrickHammer gives 1 stone when building improvement costing >= 2 clay
    const game = t.fixture({ cardSets: ['minorD'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['brick-hammer-d080'],
        clay: 3,
        stone: 1,
      },
      actionSpaces: ['Major Improvement'],
    })
    game.run()

    // Buy Clay Oven (costs 3 clay, 1 stone) — BrickHammer should trigger
    // No grain, so onBuy won't offer bake bread
    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Clay Oven (clay-oven)')

    t.testBoard(game, {
      dennis: {
        clay: 0,
        stone: 1, // 1 - 1 (cost) + 1 (BrickHammer) = 1
        majorImprovements: ['clay-oven'],
        minorImprovements: ['brick-hammer-d080'],
      },
    })
  })

  test('log customization: custom template and args', () => {
    // BasketWeaver uses custom log template
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['basket-weaver-c095'],
        stone: 2,
        reed: 2,
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Basket Weaver')

    // Verify the custom log message was used
    const logs = game.log.getLog().filter(e => e.template).map(e => e.template)
    expect(logs).toContain("{player} builds {card} for 1 stone and 1 reed via {source}")
  })
})
