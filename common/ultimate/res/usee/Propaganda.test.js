Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Propaganda', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Propaganda'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Propaganda')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Propaganda'],
      },
    })
  })

})