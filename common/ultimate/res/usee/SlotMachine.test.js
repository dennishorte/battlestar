Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Slot Machine', () => {

  test('dogma: 3 greens', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Slot Machine'],
      },
      decks: {
        base: {
          2: ['Monotheism'],
          3: ['Paper'],
          4: ['Navigation'],
          5: ['Coal'],
        },
        usee: {
          1: ['Dance'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Slot Machine')

    t.testGameOver(request, 'dennis', 'Slot Machine')
  })

  test('dogma: 2 greens', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Slot Machine', 'Astronomy'],
      },
      decks: {
        base: {
          2: ['Monotheism'],
          3: ['Paper'],
          4: ['Reformation'],
          5: ['Coal'],
        },
        usee: {
          1: ['Dance'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Slot Machine')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Slot Machine', 'Astronomy'],
          splay: 'right',
        },
        score: ['Dance', 'Monotheism', 'Paper', 'Reformation', 'Coal'],
      },
    })
  })

  test('dogma: 1 green', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Slot Machine', 'Astronomy'],
      },
      decks: {
        base: {
          2: ['Monotheism'],
          3: ['Optics'],
          4: ['Reformation'],
          5: ['Coal'],
        },
        usee: {
          1: ['Dance'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Slot Machine')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Slot Machine', 'Astronomy'],
          splay: 'right',
        },
      },
    })
  })

})
