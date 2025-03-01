Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Shigeru Miyamoto', () => {

  test('echo (with i)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Shigeru Miyamoto'],
        green: ['Databases'],
      },
      decks: {
        base: {
          10: ['Software']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Shigeru Miyamoto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Shigeru Miyamoto'],
        green: ['Databases'],
        hand: ['Software'],
      },
    })
  })

  test('echo (without i)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Shigeru Miyamoto'],
        green: ['Databases']
      },
      decks: {
        base: {
          10: ['Globalization']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Shigeru Miyamoto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Shigeru Miyamoto'],
        green: ['Databases'],
        score: ['Globalization'],
      },
    })
  })

  test('karma (win)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Shigeru Miyamoto'],
      },
      decks: {
        base: {
          10: ['Software']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Shigeru Miyamoto')

    t.testGameOver(request, 'dennis', 'Shigeru Miyamoto')
  })
})
