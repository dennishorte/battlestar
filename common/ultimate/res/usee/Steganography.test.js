Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Steganography', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Steganography'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Steganography')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        purple: ['Steganography'],
      },
    })
  })

})