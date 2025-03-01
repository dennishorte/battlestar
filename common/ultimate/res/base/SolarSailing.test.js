Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Solar Sailing', () => {

  test('dogma, already splayed', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Solar Sailing'],
        red: {
          cards: ['Metalworking', 'Oars', 'Road Building', 'Optics'],
          splay: 'aslant',
        },
      },
      decks: {
        base: {
          11: ['Astrogeology'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Solar Sailing')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Solar Sailing'],
        red: {
          cards: ['Astrogeology', 'Metalworking', 'Oars', 'Road Building', 'Optics'],
          splay: 'aslant',
        },
      },
    })
  })

  test('dogma, splayed another direction', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Solar Sailing'],
        red: {
          cards: ['Metalworking', 'Oars'],
          splay: 'right',
        },
      },
      decks: {
        base: {
          11: ['Astrogeology'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Solar Sailing')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Solar Sailing'],
        red: {
          cards: ['Astrogeology', 'Metalworking', 'Oars'],
          splay: 'aslant',
        },
      },
    })
  })

  test('dogma, return some cards', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Solar Sailing'],
        red: ['Metalworking', 'Oars', 'Construction', 'Optics'],
      },
      decks: {
        base: {
          11: ['Astrogeology'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Solar Sailing')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Solar Sailing'],
        red: {
          cards: ['Astrogeology', 'Metalworking', 'Oars', 'Construction'],
          splay: 'aslant',
        },
      },
    })
  })

  test('dogma, you win', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Solar Sailing'],
        red: {
          cards: ['Metalworking', 'Oars', 'Road Building', 'Optics', 'Flight'],
          splay: 'aslant',
        },
      },
      decks: {
        base: {
          11: ['Astrogeology'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Solar Sailing')

    t.testGameOver(request, 'dennis', 'Solar Sailing')
  })
})
