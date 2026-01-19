Error.stackTraceLimit = 100

import t from '../../testutil.js'

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
    request = t.choose(game, request, 'Dogma.Databases')
    request = t.choose(game, request, 'Tools', 'Reformation')
    request = t.choose(game, request, 'auto')

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
