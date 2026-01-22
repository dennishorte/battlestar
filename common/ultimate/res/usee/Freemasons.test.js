Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Freemasons', () => {

  test('dogma: tuck yellow', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Freemasons'],
        hand: ['Masonry', 'Optics', 'Metalworking'],
      },
      decks: {
        base: {
          3: ['Paper'],
        },
        usee: {
          3: ['Knights Templar'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Freemasons')
    request = t.choose(game, 'Masonry', 'Optics', 'Metalworking')
    request = t.choose(game, 'Masonry', 'Optics')
    request = t.choose(game, 'auto')
    request = t.choose(game, 'yellow')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: {
          cards: ['Freemasons', 'Masonry'],
          splay: 'left',
        },
        red: ['Optics'],
        hand: ['Metalworking', 'Knights Templar', 'Paper'],
      },
    })
  })

  test('dogma: tuck expansion', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Freemasons'],
        hand: ['Myth'],
      },
      decks: {
        base: {
          3: ['Paper'],
        },
        usee: {
          3: ['Knights Templar'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Freemasons')
    request = t.choose(game, 'Myth')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Freemasons'],
        purple: ['Myth'],
        hand: ['Knights Templar', 'Paper'],
      },
    })
  })

  test('dogma: tuck base non-yellow', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Freemasons'],
        hand: ['Optics'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Freemasons')
    request = t.choose(game, 'Optics')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Freemasons'],
        red: ['Optics'],
      },
    })
  })

})
