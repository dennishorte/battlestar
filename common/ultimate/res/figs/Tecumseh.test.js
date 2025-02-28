Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Tecumseh', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Tecumseh'],
        green: ['Navigation'],
      },
      decks: {
        base: {
          6: ['Classification'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Tecumseh')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Tecumseh'],
        green: ['Navigation', 'Classification'],
      },
    })
  })

  test('karma: tuck', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Tecumseh'],
        green: {
          cards: ['Corporations', 'Electricity'],
          splay: 'up',
        }
      },
      micah: {
        red: ['Coal'],
        green: ['Banking'],
      },
      decks: {
        base: {
          6: ['Canning'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Tecumseh')

    t.testChoices(request2, ['Coal', 'Banking'])

    const request3 = t.choose(game, request2, 'Coal')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Tecumseh'],
        yellow: ['Canning'],
        green: {
          cards: ['Corporations', 'Electricity'],
          splay: 'up',
        }
      },
      micah: {
        green: ['Banking'],
      },
    })
  })
})
