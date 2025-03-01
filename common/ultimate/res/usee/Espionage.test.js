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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Espionage')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Espionage'],
      },
    })
  })

})