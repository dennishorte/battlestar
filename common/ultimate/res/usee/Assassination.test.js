Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Assassination', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Assassination'],
      },
      micah: {
        blue: ['Writing'],
      },
      decks: {
        usee: {
          1: ['Palmistry'],
        }
      },
      achievements: ['Confidence'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Assassination')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Assassination'],
        score: ['Palmistry', 'Writing'],
        achievements: ['Confidence'],
      },
    })
  })

})
