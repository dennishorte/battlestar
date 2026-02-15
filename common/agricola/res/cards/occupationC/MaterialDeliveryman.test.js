const t = require('../../../testutil_v2.js')

describe('Material Deliveryman', () => {
  // Card text: "Each time any player takes 5/6/7/8+ goods from an accumulation
  // space, you get 1 wood/clay/reed/stone from the general supply."

  test('gives 1 wood when 5 goods taken from accumulation space', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Forest', accumulated: 5 }],
      firstPlayer: 'micah',
      dennis: {
        occupations: ['material-deliveryman-c163'],
      },
    })
    game.run()

    // micah takes Forest with 5 wood → MaterialDeliveryman: dennis gets 1 wood
    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        occupations: ['material-deliveryman-c163'],
        wood: 1,
      },
    })
  })

  test('gives nothing when fewer than 5 goods taken', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Forest', accumulated: 4 }],
      firstPlayer: 'micah',
      dennis: {
        occupations: ['material-deliveryman-c163'],
      },
    })
    game.run()

    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        occupations: ['material-deliveryman-c163'],
        wood: 0,
      },
    })
  })
})
