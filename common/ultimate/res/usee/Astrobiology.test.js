Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Astrobiology', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Astrobiology'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Astrobiology')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Astrobiology'],
      },
    })
  })

})