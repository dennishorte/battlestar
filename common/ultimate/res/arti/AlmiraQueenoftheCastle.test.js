Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Almira, Queen of the Castle', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Almira, Queen of the Castle'],
        hand: ['Experimentation'],
      },
      achievements: ['Engineering', 'Enterprise', 'Astronomy'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        blue: ['Experimentation'],
        achievements: ['Enterprise'],
      },
    })
  })
})
