Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Molasses Reef Caravel", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Molasses Reef Caravel"],
        hand: ['Tools'],
        score: ['Sailing'],
      },
      decks: {
        base: {
          4: ['Gunpowder', 'Reformation', 'Experimentation'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'Reformation')
    const request4 = t.choose(game, request3, 'Sailing')

    t.testIsFirstAction(request4)
    t.testBoard(game, {
      dennis: {
        blue: ['Experimentation'],
        score: ['Reformation'],
        hand: ['Gunpowder'],
      },
    })
  })

  test('dogma: no blue', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Molasses Reef Caravel"],
        hand: ['Tools'],
        score: ['Sailing'],
      },
      decks: {
        base: {
          4: ['Gunpowder', 'Enterprise', 'Reformation'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'Reformation')
    const request4 = t.choose(game, request3, 'Sailing')

    t.testIsFirstAction(request4)
    t.testBoard(game, {
      dennis: {
        score: ['Reformation'],
        hand: ['Gunpowder', 'Enterprise'],
      },
    })
  })
})
