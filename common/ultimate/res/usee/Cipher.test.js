Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Cipher', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Cipher'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Cipher')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Cipher'],
      },
    })
  })

})