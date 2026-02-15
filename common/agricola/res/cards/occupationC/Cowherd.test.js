const t = require('../../../testutil_v2.js')

describe('Cowherd', () => {
  // Card text: "Each time you use the 'Cattle Market' accumulation space,
  // you get 1 additional cattle."

  test('gives extra cattle on Cattle Market', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
        'Vegetable Seeds', 'Pig Market',
        'Cattle Market',
      ],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['cowherd-c147'],
        food: 10,
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }] }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // Take Cattle Market — gets 1 base + 1 from Cowherd = 2
    t.choose(game, 'Cattle Market')

    t.testBoard(game, {
      dennis: {
        food: 10,
        occupations: ['cowherd-c147'],
        animals: { cattle: 2 },
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], cattle: 2 }],
        },
      },
    })
  })
})
