const t = require('../../../testutil_v2.js')

describe('Excavator', () => {
  // Card text: "Each time after you use the 'Day Laborer' action space,
  // you get 1 additional wood and clay, and you can buy 1 stone for 1 food."

  test('gives wood and clay on Day Laborer', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['excavator-c126'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    // Offered to buy stone for 1 food
    t.choose(game, 'Pay 1 food for 1 stone')

    t.testBoard(game, {
      dennis: {
        food: 11,  // 10 + 2 from Day Laborer - 1 for stone
        wood: 1,
        clay: 1,
        stone: 1,
        occupations: ['excavator-c126'],
      },
    })
  })
})
