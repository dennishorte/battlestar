const t = require('../../../testutil_v2.js')

describe('Animal Dealer', () => {
  // Card is 3+ players. onAction: Sheep/Pig/Cattle Market → may buy 1 additional animal of that type for 1 food.

  test('onAction offers buy 1 sheep for 1 food when using Sheep Market', () => {
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

  test('onAction allows skip', () => {
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

  test('onAction offers buy 1 cattle for 1 food when using Cattle Market', () => {
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
