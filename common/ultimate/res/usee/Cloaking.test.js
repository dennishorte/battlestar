Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Cloaking', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Cloaking'],
      },
      micah: {
        achievements: ['Monument', 'Tools'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Cloaking')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Cloaking'],
        safe: ['Tools'],
      },
      micah: {
        achievements: ['Monument'],
      },
    })
  })

})
