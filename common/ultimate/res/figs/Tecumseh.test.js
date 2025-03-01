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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Tecumseh')

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Tecumseh')

    t.testChoices(request, ['Coal', 'Banking'])

    request = t.choose(game, request, 'Coal')

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
