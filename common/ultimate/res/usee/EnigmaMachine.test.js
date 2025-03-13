Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Enigma Machine', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Enigma Machine'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Enigma Machine')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Enigma Machine'],
      },
    })
  })

})