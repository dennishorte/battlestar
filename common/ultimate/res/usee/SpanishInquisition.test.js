Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Spanish Inquisition', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Spanish Inquisition', 'Metalworking'],
      },
      micah: {
        hand: ['Tools', 'Construction', 'Reformation'],
        score: ['Machinery', 'Optics', 'Monotheism'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Spanish Inquisition')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
      },
      micah: {
        hand: ['Reformation'],
        score: ['Machinery', 'Optics'],
      },
    })
  })

})
