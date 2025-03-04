Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Smuggling', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Smuggling'],
        yellow: ['Perspective'],
      },
      micah: {
        yellow: ['Domestication'],
        score: ['Agriculture', 'Heirloom', 'Machinery'],
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Smuggling')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Smuggling'],
        yellow: ['Perspective'],
        score: ['Agriculture', 'Heirloom'],
      },
      micah: {
        yellow: ['Domestication'],
        score: ['Machinery'],
      }
    })
  })

})
