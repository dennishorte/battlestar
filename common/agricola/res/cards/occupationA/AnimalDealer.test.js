const t = require('../../../testutil_v2.js')

describe('Animal Dealer', () => {
  // Card is 3+ players. Before the market animals are placed, the player may
  // buy 1 additional animal of that type for 1 food. The purchase is paid
  // first, then the market animals and the bought animal are placed together.

  test('offers buy 1 sheep for 1 food when using Sheep Market', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: [{ ref: 'Sheep Market', accumulated: 1 }],
      dennis: {
        occupations: ['animal-dealer-a147'],
        food: 3,
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })
    game.run()

    t.choose(game, 'Sheep Market')
    t.choose(game, 'Buy 1 sheep for 1 food')

    t.testBoard(game, {
      dennis: {
        occupations: ['animal-dealer-a147'],
        food: 2,
        animals: { sheep: 2 },
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }], sheep: 2 }],
        },
      },
    })
  })

  test('allows skip', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: [{ ref: 'Sheep Market', accumulated: 1 }],
      dennis: {
        occupations: ['animal-dealer-a147'],
        food: 3,
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })
    game.run()

    t.choose(game, 'Sheep Market')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        occupations: ['animal-dealer-a147'],
        food: 3,
        animals: { sheep: 1 },
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }], sheep: 1 }],
        },
      },
    })
  })

  test('offers the extra sheep even when the market sheep took the last spot', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: [{ ref: 'Sheep Market', accumulated: 1 }],
      dennis: {
        occupations: ['animal-dealer-a147'],
        food: 3,
        // No pasture. The market sheep fills the only pet slot.
      },
    })
    game.run()

    t.choose(game, 'Sheep Market')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        occupations: ['animal-dealer-a147'],
        food: 3,
        pet: 'sheep',
        animals: { sheep: 1 },
      },
    })
  })

  test('does not let cooking the market sheep pay for the extra sheep', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: [{ ref: 'Sheep Market', accumulated: 2 }],
      dennis: {
        occupations: ['animal-dealer-a147'],
        majorImprovements: ['fireplace-2'],
        food: 0,
      },
    })
    game.run()

    // Two sheep, and only the pet slot. One is placed and one is cooked.
    // The buy prompt must not appear after that cooking produces food.
    t.choose(game, 'Sheep Market')
    t.action(game, 'animal-placement', {
      placements: [],
      overflow: { cook: { sheep: 1 } },
    })

    expect(t.currentChoices(game)).not.toContain('Buy 1 sheep for 1 food')

    t.testBoard(game, {
      dennis: {
        occupations: ['animal-dealer-a147'],
        majorImprovements: ['fireplace-2'],
        food: 2,
        pet: 'sheep',
        animals: { sheep: 1 },
      },
    })
  })

  test('asks to buy before placing market sheep that do not fit', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: [{ ref: 'Sheep Market', accumulated: 2 }],
      dennis: {
        occupations: ['animal-dealer-a147'],
        majorImprovements: ['fireplace-2'],
        food: 1,
      },
    })
    game.run()

    t.choose(game, 'Sheep Market')
    t.choose(game, 'Buy 1 sheep for 1 food')
    // 3 sheep, pet slot holds 1. The other 2 are cooked after the food is spent.
    t.action(game, 'animal-placement', {
      placements: [],
      overflow: { cook: { sheep: 2 } },
    })

    t.testBoard(game, {
      dennis: {
        occupations: ['animal-dealer-a147'],
        majorImprovements: ['fireplace-2'],
        food: 4, // 1 paid, fireplace cooks 2 sheep for 4
        pet: 'sheep',
        animals: { sheep: 1 },
      },
    })
  })

  test('bought sheep that will not fit can be cooked', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: [{ ref: 'Sheep Market', accumulated: 1 }],
      dennis: {
        occupations: ['animal-dealer-a147'],
        majorImprovements: ['fireplace-2'],
        food: 3,
      },
    })
    game.run()

    t.choose(game, 'Sheep Market')
    t.choose(game, 'Buy 1 sheep for 1 food')
    t.action(game, 'animal-placement', {
      placements: [],
      overflow: { cook: { sheep: 1 } },
    })

    t.testBoard(game, {
      dennis: {
        occupations: ['animal-dealer-a147'],
        majorImprovements: ['fireplace-2'],
        food: 4, // 3 paid, fireplace cooks the extra sheep for 2
        pet: 'sheep',
        animals: { sheep: 1 },
      },
    })
  })

  test('offers buy 1 cattle for 1 food when using Cattle Market', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: [{ ref: 'Cattle Market', accumulated: 1 }],
      dennis: {
        occupations: ['animal-dealer-a147'],
        food: 3,
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }, { spaces: [{ row: 2, col: 1 }] }],
        },
      },
    })
    game.run()

    t.choose(game, 'Cattle Market')
    t.choose(game, 'Buy 1 cattle for 1 food')

    t.testBoard(game, {
      dennis: {
        occupations: ['animal-dealer-a147'],
        food: 2,
        animals: { cattle: 2 },
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }], cattle: 2 },
            { spaces: [{ row: 2, col: 1 }] },
          ],
        },
      },
    })
  })
})
