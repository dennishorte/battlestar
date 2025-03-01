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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Puzzle Cube')
    request = t.choose(game, request)

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Puzzle Cube')
    request = t.choose(game, request, 'red')
    request = t.choose(game, request, 1)

    t.testGameOver(request, 'dennis', 'Puzzle Cube')
  })
})
