Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Counterintelligence', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Counterintelligence'],
      },
      micah: {
        purple: ['Astronomy', 'Monotheism', 'Polytheism'],
        green: ['Navigation'],
      },
      decks: {
        usee: {
          7: ['Slot Machine'],
          8: ['Concealment'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Counterintelligence')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Counterintelligence'],
        purple: ['Monotheism'],
        hand: ['Concealment'],
      },
      micah: {
        purple: ['Polytheism', 'Astronomy'],
        green: ['Navigation'],
        hand: ['Slot Machine'],
      },
    })
  })

})
