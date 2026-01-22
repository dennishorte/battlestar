Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Propaganda', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Propaganda'],
        hand: ['Mathematics'],
      },
      micah: {
        yellow: ['Agriculture'],
        hand: ['Tools', 'Domestication'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Propaganda')
    request = t.choose(game, 'yellow')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Agriculture'],
        purple: ['Propaganda'],
        blue: ['Mathematics'],
      },
      micah: {
        yellow: ['Domestication'],
        hand: ['Tools'],
      }
    })
  })

})
