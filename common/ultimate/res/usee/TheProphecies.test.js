Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('The Prophecies', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['The Prophecies'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.The Prophecies')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['The Prophecies'],
      },
    })
  })

})