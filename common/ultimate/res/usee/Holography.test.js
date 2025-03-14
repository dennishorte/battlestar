Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Holography', () => {

  test('dogma: only two cards', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Holography'],
        red: ['Optics', 'Metalworking'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Holography')
    request = t.choose(game, request, 'red')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Holography'],
        red: {
          cards: ['Optics', 'Metalworking'],
          splay: 'aslant',
        },
      },
    })
  })

  test('dogma: already aslant', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Holography'],
        red: {
          cards: ['Optics', 'Metalworking', 'Flight'],
          splay: 'aslant',
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Holography')
    request = t.choose(game, request, 'red')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Holography'],
        red: {
          cards: ['Optics', 'Metalworking'],
          splay: 'aslant',
        },
        score: ['Flight'],
      },
    })
  })

  test('dogma: do both; no achievements', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Holography'],
        red: {
          cards: ['Optics', 'Metalworking', 'Flight'],
          splay: 'right',
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Holography')
    request = t.choose(game, request, 'red')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Holography'],
        red: {
          cards: ['Optics', 'Metalworking'],
          splay: 'aslant',
        },
        achievements: ['Flight'],
      },
    })
  })

  test('dogma: do both; no achievements of correct value', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Holography'],
        red: {
          cards: ['Optics', 'Metalworking', 'Flight'],
          splay: 'right',
        },
        achievements: ['Socialism'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Holography')
    request = t.choose(game, request, 'red')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Holography'],
        red: {
          cards: ['Optics', 'Metalworking'],
          splay: 'aslant',
        },
        achievements: ['Flight', 'Socialism'],
      },
    })
  })

  test('dogma: do both; swap achievements', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Holography'],
        red: {
          cards: ['Optics', 'Metalworking', 'Flight'],
          splay: 'right',
        },
        score: ['Genetics'],
        achievements: ['Socialism', 'Evolution', 'Tools'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Holography')
    request = t.choose(game, request, 'red')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Holography'],
        red: {
          cards: ['Optics', 'Metalworking'],
          splay: 'aslant',
        },
        score: ['Genetics', 'Evolution', 'Tools'],
        achievements: ['Flight', 'Socialism'],
      },
    })
  })

})
