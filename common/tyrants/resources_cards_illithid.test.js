Error.stackTraceLimit = 100

const t = require('./testutil.js')


describe('Illithids expansion', () => {
  describe('Aboleth', () => {

  })

  describe('Ambassador', () => {
    test('promote', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'illithid'],
        dennis: {
          hand: ['Ambassador', 'House Guard'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.House Guard')
      const request3 = t.choose(game, request2, 'Play Card.Ambassador')
      const request4 = t.choose(game, request3, 'Pass')

      t.testBoard(game, {
        dennis: {
          discard: ['Ambassador'],
          innerCircle: ['House Guard'],
        },
      })
    })

    test.skip('on discard', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'illithid'],
        dennis: {
          hand: ['Gauth'],
        },
        micah: {
          hand: ['House Guard', 'House Guard', 'House Guard', 'Ambassador'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Gauth')

    })
  })

  describe('Gauth', () => {
    test('influence', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'illithid'],
        dennis: {
          hand: ['Gauth'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Gauth')
      const request3 = t.choose(game, request2, '+2 influence')

      t.testBoard(game, {
        dennis: {
          hand: [],
          played: ['Gauth'],
          influence: 2,
        }
      })
    })

    test('Draw and opponents discard', () => {
      const game = t.gameFixture({
        expansions: ['drow', 'illithid'],
        dennis: {
          hand: ['Gauth'],
        },
        micah: {
          hand: ['House Guard', 'House Guard', 'House Guard', 'Ambassador'],
        },
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Gauth')
      const request3 = t.choose(game, request2, '*Draw a card. Choose one opponent with more than 3 cards to discard a card')
      const request4 = t.choose(game, request3, 'House Guard')

      t.testBoard(game, {
        dennis: {
          hand: ['Soldier'],
          played: ['Gauth'],
        },
        micah: {
          hand: ['House Guard', 'House Guard', 'Ambassador'],
          discard: ['House Guard'],
        },
      })
    })
  })
})
