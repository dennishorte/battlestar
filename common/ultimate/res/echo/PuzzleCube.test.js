Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Puzzle Cube", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Puzzle Cube'],
        red: {
          cards: ['Archery', 'Construction'],
          splay: 'left'
        },
      },
      decks: {
        base: {
          10: ['Software'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Puzzle Cube')
    const request3 = t.choose(game, request2)

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        purple: ['Puzzle Cube'],
        red: {
          cards: ['Archery', 'Construction'],
          splay: 'left'
        },
        blue: ['Software'],
      },
    })
  })

  test('dogma: win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Puzzle Cube'],
        red: {
          cards: ['Archery', 'Construction'],
          splay: 'left'
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Puzzle Cube')
    const request3 = t.choose(game, request2, 'red')
    const request4 = t.choose(game, request3, 1)

    t.testGameOver(request4, 'dennis', 'Puzzle Cube')
  })
})
