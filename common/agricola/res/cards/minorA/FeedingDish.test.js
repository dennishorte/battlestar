const t = require('../../../testutil_v2.js')

describe('Feeding Dish', () => {
  test('gives grain when taking sheep and already have sheep', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['feeding-dish-a066'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }], sheep: 2 }],
        },
      },
      actionSpaces: ['Sheep Market'],
    })
    game.run()

    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      dennis: {
        grain: 1, // +1 from Feeding Dish
        minorImprovements: ['feeding-dish-a066'],
        animals: { sheep: 3 },
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }], sheep: 3 }],
        },
      },
    })
  })

  test('does not trigger on non-animal actions', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['feeding-dish-a066'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }], sheep: 2 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        wood: 3, // from Forest
        minorImprovements: ['feeding-dish-a066'],
        animals: { sheep: 2 },
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }], sheep: 2 }],
        },
      },
    })
  })
})
