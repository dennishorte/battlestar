Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Tomb', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Tomb'],
        blue: ['Tools', 'Writing'],
        green: ['The Wheel'],
        achievements: ['Agriculture'],
      },
      achievements: ['Domestication', 'Construction', 'Optics'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Tomb')
    request = t.choose(game, request, 'yes')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['The Wheel'],
        hand: ['Domestication'],
        safe: ['Construction'],
        achievements: ['Agriculture'],
      },
    })
  })

})
