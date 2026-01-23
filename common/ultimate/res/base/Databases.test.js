Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Databases', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        green: ['Databases'],
      },
      micah: {
        score: ['Tools', 'Enterprise', 'Reformation'],
        achievements: ['Road Building']
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Databases')
    request = t.choose(game, 'Tools', 'Reformation')
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Databases'],
      },
      micah: {
        score: ['Enterprise'],
        achievements: ['Road Building']
      }
    })
  })

})
