Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Heirloom', () => {

  test('dogma: has secret', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Heirloom'],
        safe: ['Monotheism'],
      },
      achievements: [],
      decks: {
        usee: {
          3: ['Knights Templar']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Heirloom')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Heirloom'],
        hand: ['Knights Templar'],
      },
    })
  })

  test('dogma: no secret', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Gunpowder'],
        yellow: ['Heirloom'],
      },
      achievements: ['Legend'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Heirloom')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Gunpowder'],
        yellow: ['Heirloom'],
        safe: ['Legend'],
      },
    })
  })

})
