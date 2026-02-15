const t = require('../../../testutil_v2.js')

describe('Cattle Buyer', () => {
  // Card text: "Each time another player uses the 'Fencing' action space,
  // you can buy exactly 1 sheep/wild boar/cattle for 1/2/2 food."

  test('offers animal purchase when another player fences', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
        'Vegetable Seeds', 'Pig Market',
      ],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['cattle-buyer-c167'],
        food: 10,
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }] }],
        },
      },
      micah: {
        food: 10,
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }] }],
        },
      },
      scott: { food: 10 },
      valerie: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Fencing')      // micah -> triggers Cattle Buyer for dennis
    t.choose(game, 'Buy 1 sheep for 1 food')

    t.testBoard(game, {
      dennis: {
        food: 11,
        occupations: ['cattle-buyer-c167'],
        animals: { sheep: 1 },
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 1 }],
        },
      },
    })
  })
})
