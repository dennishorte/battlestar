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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Steganography')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Steganography'],
      },
    })
  })

})