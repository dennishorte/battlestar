Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Holy Grail', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Holy Grail'],
        hand: ['Fermenting'],
      },
      achievements: ['The Wheel', 'Construction'],
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        achievements: ['Construction'],
        museum: ['Museum 1', 'Holy Grail'],
      },
    })
  })

  test('dogma: empty hand', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Holy Grail'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        museum: ['Museum 1', 'Holy Grail'],
      },
    })
  })
})
