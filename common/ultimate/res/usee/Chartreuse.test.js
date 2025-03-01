Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Chartreuse', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Chartreuse'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Chartreuse')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Chartreuse'],
      },
    })
  })

})