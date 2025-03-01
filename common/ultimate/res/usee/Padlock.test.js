Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Padlock', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Padlock'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Padlock')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Padlock'],
      },
    })
  })

})