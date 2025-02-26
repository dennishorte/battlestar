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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Shigeru Miyamoto')

    t.testIsSecondPlayer(request2)
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Shigeru Miyamoto')

    t.testIsSecondPlayer(request2)
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Shigeru Miyamoto')

    t.testGameOver(request2, 'dennis', 'Shigeru Miyamoto')
  })
})
