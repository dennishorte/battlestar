Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Joy Buzzer', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Joy Buzzer', 'Monotheism'],
        hand: ['Tools', 'Coal'],
      },
      micah: {
        hand: ['Software', 'Optics'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Joy Buzzer')
    request = t.choose(game, request, 10)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Monotheism'],
        hand: ['Optics', 'Coal'],
        score: ['Software', 'Joy Buzzer'],
      },
      micah: {
        hand: ['Tools'],
      },
    })
  })

})
