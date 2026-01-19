Error.stackTraceLimit = 100

import t from '../../testutil.js'

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
        museum: ['Museum 1', 'Almira, Queen of the Castle'],
      },
    })
  })

  test('dogma: no meld', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Almira, Queen of the Castle'],
      },
      achievements: ['Construction', 'Machinery'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        museum: ['Museum 1', 'Almira, Queen of the Castle'],
      },
    })
    t.testDeckIsJunked(game, 2)
  })
})
