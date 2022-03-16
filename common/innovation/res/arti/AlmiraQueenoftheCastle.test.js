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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        blue: ['Experimentation'],
        achievements: ['Enterprise'],
      },
    })
  })
})
