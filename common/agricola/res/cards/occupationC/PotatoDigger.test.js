const t = require('../../../testutil_v2.js')

describe('Potato Digger', () => {
  // Card text: "When you play this card, if you have at least 2/4/5 unplanted
  // field tiles, you immediately get 1/2/3 vegetables."

  test('2 unplanted fields gives 1 vegetable', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['potato-digger-c161'],
        food: 10,
        farmyard: {
          fields: [{ row: 2, col: 0 }, { row: 2, col: 1 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Potato Digger')

    t.testBoard(game, {
      dennis: {
        food: 10,
        vegetables: 1,
        occupations: ['potato-digger-c161'],
        farmyard: {
          fields: [{ row: 2, col: 0 }, { row: 2, col: 1 }],
        },
      },
    })
  })

  test('5 unplanted fields gives 3 vegetables', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['potato-digger-c161'],
        food: 10,
        farmyard: {
          fields: [
            { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 },
            { row: 2, col: 3 }, { row: 2, col: 4 },
          ],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Potato Digger')

    t.testBoard(game, {
      dennis: {
        food: 10,
        vegetables: 3,
        occupations: ['potato-digger-c161'],
        farmyard: {
          fields: [
            { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 },
            { row: 2, col: 3 }, { row: 2, col: 4 },
          ],
        },
      },
    })
  })
})
