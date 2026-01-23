Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Sniping', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Sniping'],
      },
      micah: {
        green: {
          cards: ['Measurement', 'Paper', 'The Wheel'],
          splay: 'right',
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Sniping')
    request = t.choose(game, 'green')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Sniping'],
        green: ['Paper'],
      },
      micah: {
        green: ['The Wheel', 'Measurement'],
      },
    })
  })

})
