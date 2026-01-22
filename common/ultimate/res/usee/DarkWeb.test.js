Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Dark Web', () => {

  test('dogma: safeguard', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: {
          cards: ['Dark Web', 'Metalworking'],
          splay: 'up',
        }
      },
      micah: {
        green: {
          cards: ['Paper', 'Mapmaking'],
          splay: 'right',
        }
      },
      achievements: ['Tools', 'Domestication', 'Legend', 'Optics'],
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Dark Web')
    request = t.choose(game, 'micah.green')
    request = t.choose(game, 'Safeguard achievements')
    request = t.choose(game, '**base-1*', '**base-1*')
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Dark Web', 'Metalworking'],
          splay: 'up',
        },
        safe: ['Tools', 'Domestication'],
      },
      micah: {
        green: ['Paper', 'Mapmaking'],
      },
    })
  })

  test('dogma: achieve', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: {
          cards: ['Dark Web', 'Metalworking'],
          splay: 'up',
        },
        safe: ['Tools', 'Domestication'],
      },
      micah: {
        green: {
          cards: ['Paper', 'Mapmaking'],
          splay: 'right',
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Dark Web')
    request = t.choose(game, 'micah.green')
    request = t.choose(game, 'Achieve secrets')
    request = t.choose(game, '**base-1* (dennis)', '**base-1* (dennis)')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Dark Web', 'Metalworking'],
          splay: 'up',
        },
        achievements: ['Tools', 'Domestication'],
      },
      micah: {
        green: ['Paper', 'Mapmaking'],
      },
    })
  })

})
