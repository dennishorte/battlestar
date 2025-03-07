Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Sabotage', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Sabotage'],
      },
      micah: {
        purple: ['Reformation', 'Monotheism'],
        score: ['The Wheel', 'Code of Laws'],
      },
      decks: {
        usee: {
          6: ['Triad'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Sabotage')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Sabotage'],
      },
      micah: {
        purple: ['Monotheism', 'Reformation', 'Code of Laws'],
        score: ['The Wheel'],
      },
    })
  })

})
