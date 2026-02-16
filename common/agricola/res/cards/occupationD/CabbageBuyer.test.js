const t = require('../../../testutil_v2.js')

describe('Cabbage Buyer', () => {
  test('buys vegetable when opponent renovates', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['House Redevelopment'],
      firstPlayer: 'micah',
      micah: {
        roomType: 'wood',
        clay: 2,
        reed: 1,
      },
      dennis: {
        occupations: ['cabbage-buyer-d161'],
        food: 4,
      },
    })
    game.run()

    // micah takes House Redevelopment: renovate wood → clay (auto-selected)
    // After renovation, onAnyRenovate fires → CabbageBuyer triggers for dennis
    t.choose(game, 'House Redevelopment')

    // CabbageBuyer triggers: buy 1 vegetable for 2 food
    t.choose(game, 'Buy 1 vegetable for 2 food')

    // micah improvement step: auto-skip (can't afford any)
    // Continue remaining actions
    t.choose(game, 'Day Laborer')    // dennis: +2 food
    t.choose(game, 'Forest')         // micah
    t.choose(game, 'Grain Seeds')    // dennis
    t.choose(game, 'Clay Pit')       // micah

    t.testBoard(game, {
      dennis: {
        occupations: ['cabbage-buyer-d161'],
        food: 4,  // 4 - 2(cabbage) + 2(DL)
        vegetables: 1,
        grain: 1,
      },
    })
  })

  test('buys vegetable when self renovates', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['House Redevelopment'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['cabbage-buyer-d161'],
        roomType: 'wood',
        clay: 2,
        reed: 1,
        food: 4,
      },
    })
    game.run()

    // dennis takes House Redevelopment: renovate wood → clay (auto-selected)
    // onAnyRenovate fires → CabbageBuyer triggers for dennis (self)
    t.choose(game, 'House Redevelopment')

    // CabbageBuyer triggers
    t.choose(game, 'Buy 1 vegetable for 2 food')

    // improvement step: auto-skip (can't afford any)
    // Continue remaining actions
    t.choose(game, 'Forest')         // micah
    t.choose(game, 'Day Laborer')    // dennis: +2 food
    t.choose(game, 'Grain Seeds')    // micah

    t.testBoard(game, {
      dennis: {
        occupations: ['cabbage-buyer-d161'],
        roomType: 'clay',
        food: 4,  // 4 - 2(cabbage) + 2(DL)
        vegetables: 1,
        clay: 0,
        reed: 0,
      },
    })
  })

  test('can skip buying vegetable', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['House Redevelopment'],
      firstPlayer: 'micah',
      micah: {
        roomType: 'wood',
        clay: 2,
        reed: 1,
      },
      dennis: {
        occupations: ['cabbage-buyer-d161'],
        food: 4,
      },
    })
    game.run()

    t.choose(game, 'House Redevelopment')
    t.choose(game, 'Skip')

    // Continue remaining actions
    t.choose(game, 'Day Laborer')    // dennis
    t.choose(game, 'Forest')         // micah
    t.choose(game, 'Grain Seeds')    // dennis
    t.choose(game, 'Clay Pit')       // micah

    t.testBoard(game, {
      dennis: {
        occupations: ['cabbage-buyer-d161'],
        food: 6,  // 4 + 2(DL)
        vegetables: 0,
        grain: 1,
      },
    })
  })
})
