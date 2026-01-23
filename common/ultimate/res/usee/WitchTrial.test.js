Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Witch Trial', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Witch Trial'],
      },
      micah: {
        red: ['Metalworking', 'Oars'],
        purple: ['Reformation'],
        score: ['The Wheel'],
        hand: ['Optics', 'Monotheism', 'Agriculture'],
      },
      decks: {
        base: {
          5: ['Astronomy'],
        },
        usee: {
          5: ['Cabal'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Witch Trial')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Witch Trial'],
      },
      micah: {
        red: ['Oars'],
        hand: ['Agriculture', 'Cabal', 'Astronomy'],
      },
    })
  })

})
