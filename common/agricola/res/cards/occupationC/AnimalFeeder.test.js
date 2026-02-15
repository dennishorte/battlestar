const t = require('../../../testutil_v2.js')

describe('Animal Feeder', () => {
  // Card text: "On the 'Day Laborer' action space, you also get your choice
  // of 1 sheep or 1 grain. Instead of that good, you can buy 1 wild boar
  // for 1 food or 1 cattle for 2 food."

  test('gives grain choice on Day Laborer', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['animal-feeder-c138'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, '1 grain')

    t.testBoard(game, {
      dennis: {
        food: 12,  // 10 + 2 from Day Laborer
        grain: 1,
        occupations: ['animal-feeder-c138'],
      },
    })
  })
})
