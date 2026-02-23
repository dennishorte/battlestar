const t = require('../../../testutil_v2.js')

describe("Carpenter's Axe", () => {
  test('offers stable building when player has 7+ wood after Forest', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        wood: 4,
        minorImprovements: ['carpenters-axe-a015'],
      },
    })
    game.run()

    t.choose(game, 'Forest')                    // +3 wood = 7 total
    t.choose(game, 'Build stable at 0,1')       // build stable for 1 wood

    t.testBoard(game, {
      dennis: {
        wood: 6, // 4 + 3 (Forest) - 1 (stable)
        minorImprovements: ['carpenters-axe-a015'],
        farmyard: {
          stables: [{ row: 0, col: 1 }],
        },
      },
    })
  })

  test('offers stable building when player has 7+ wood after Grove', () => {
    const game = t.fixture({ numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        wood: 5,
        minorImprovements: ['carpenters-axe-a015'],
      },
    })
    game.run()

    t.choose(game, 'Grove')                      // +2 wood = 7 total
    t.choose(game, 'Build stable at 0,1')         // build stable for 1 wood

    t.testBoard(game, {
      dennis: {
        wood: 6, // 5 + 2 (Grove) - 1 (stable)
        minorImprovements: ['carpenters-axe-a015'],
        farmyard: {
          stables: [{ row: 0, col: 1 }],
        },
      },
    })
  })

  test('does not offer when wood < 7 after action', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        wood: 0,
        minorImprovements: ['carpenters-axe-a015'],
      },
    })
    game.run()

    t.choose(game, 'Forest') // +3 wood = 3 total, < 7

    // No stable offer — game moves to micah's turn
    t.testBoard(game, {
      dennis: {
        wood: 3,
        minorImprovements: ['carpenters-axe-a015'],
      },
    })
  })
})
