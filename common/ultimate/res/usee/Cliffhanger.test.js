Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Cliffhanger', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Cliffhanger'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Cliffhanger')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Cliffhanger'],
      },
    })
  })

})