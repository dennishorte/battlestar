const t = require('../../../testutil_v2.js')

describe('Inner Districts Director', () => {
  // Card text: "Each time you use the 'Forest' or 'Clay Pit' accumulation space,
  // you can place 1 stone from the general supply on the other space. If you do,
  // you can immediately place another person."

  test('offers stone placement on Forest action', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['inner-districts-director-c093'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Forest')
    t.choose(game, 'Place 1 stone on Clay Pit and place another person')

    t.testBoard(game, {
      dennis: {
        food: 10,
        wood: 3,
        occupations: ['inner-districts-director-c093'],
      },
    })
  })
})
