Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Brethren of Purity', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Brethren of Purity'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Brethren of Purity')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Brethren of Purity'],
      },
    })
  })

})