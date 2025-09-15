Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Area 51', () => {

  test('dogma 1', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: {
          cards: ['Area 51', 'Paper'],
          splay: 'right',
        },
        safe: ['Mapmaking'],
      },
      micah: {
        score: ['Tools'],
      },
      decks: {
        base: {
          1: ['Metalworking'],
        },
        usee: {
          11: ['Cloaking'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Area 51')
    request = t.choose(game, request, 'green')
    request = t.choose(game, request, 'Draw a 11')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: {
          cards: ['Area 51', 'Paper'],
          splay: 'up',
        },
        hand: ['Cloaking'],
        safe: ['Mapmaking'],
        score: ['Tools', 'Metalworking'],
      },
    })
  })

  test('dogma 2', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: {
          cards: ['Area 51', 'Paper'],
          splay: 'right',
        },
      },
      micah: {
        score: ['Tools'],
      },
      achievements: ['Mapmaking'],
      decks: {
        usee: {
          1: ['Tomb'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Area 51')
    request = t.choose(game, request, 'green')
    request = t.choose(game, request, 'Safeguard a standard achievement')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: {
          cards: ['Area 51', 'Paper'],
          splay: 'up',
        },
        safe: ['Mapmaking'],
        score: ['Tools', 'Tomb'],
      },
    })
  })

})
