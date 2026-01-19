Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe("Roundhay Garden Scene", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Roundhay Garden Scene"],
        score: ['Tools', 'Experimentation'],
      },
      decks: {
        base: {
          4: ['Enterprise', 'Gunpowder'],
          5: ['Astronomy'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        blue: ['Experimentation'],
        purple: ['Astronomy'],
        score: ['Tools', 'Enterprise', 'Gunpowder'],
        museum: ['Museum 1', 'Roundhay Garden Scene'],
      },
    })
  })
})
