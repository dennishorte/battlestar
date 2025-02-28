Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Espionage', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Espionage'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Espionage')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Espionage'],
      },
    })
  })

})