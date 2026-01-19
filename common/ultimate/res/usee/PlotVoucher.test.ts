Error.stackTraceLimit = 100
import t from '../../testutil.js'
describe('Plot Voucher', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Plot Voucher'],
        score: ['Oars'],
      },
      micah: {
        purple: ['Philosophy'],
        hand: ['Navigation'],
        score: ['Monotheism'],
      },
      achievements: ['Tools', 'Optics'],
      decks: {
        base: {
          1: ['The Wheel'],
        },
        usee: {
          1: ['Polytheism'],
          7: ['Private Eye'],
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Plot Voucher')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Plot Voucher'],
        red: ['Oars'],
        hand: ['Private Eye'],
        score: ['Navigation'],
        safe: ['Optics'],
      },
      micah: {
        purple: ['Monotheism', 'Philosophy', 'Polytheism'],
        hand: ['The Wheel'],
        safe: ['Tools'],
      },
    })
  })

})
