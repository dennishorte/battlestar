const t = require('../../../testutil_v2.js')

describe('Basket Carrier', () => {
  // Card text: "Once each harvest, you can buy 1 wood, 1 reed, and 1 grain
  // for 2 food total."

  test('buys wood, reed, grain for 2 food at harvest', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['basket-carrier-c105'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // Work phase
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    // Harvest → field phase → onFieldPhaseEnd: Basket Carrier
    t.choose(game, 'Buy 1 wood, 1 reed, 1 grain for 2 food')

    // Feeding automatic: 10 + 2 (DL) - 2 (BC) = 10 food, pay 4 → 6

    t.testBoard(game, {
      dennis: {
        occupations: ['basket-carrier-c105'],
        food: 6,
        wood: 1,
        reed: 1,
        grain: 2,
      },
    })
  })
})
