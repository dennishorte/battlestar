Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Palmistry', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Palmistry'],
        hand: ['Tools', 'The Wheel'],
      },
      decks: {
        base: {
          2: ['Construction'],
        },
        usee: {
          1: ['Assassination'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Palmistry')
    request = t.choose(game, request, 'Tools')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Palmistry'],
        red: ['Assassination'],
        score: ['Construction'],
      },
    })
  })

})
