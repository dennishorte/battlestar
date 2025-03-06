Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Cabal', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Cabal'],
        safe: ['Optics', 'Mathematics'],
      },
      micah: {
        hand: ['Machinery', 'Coal', 'Monotheism'],
      },
      decks: {
        usee: {
          5: ['Gallery'],
        },
      },
      achievements: ['Gunpowder', 'Measurement'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Cabal')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Cabal'],
        safe: ['Optics', 'Mathematics', 'Measurement'],
        score: ['Machinery', 'Monotheism']
      },
      micah: {
        hand: ['Coal', 'Gallery'],
      },
    })
  })

})
