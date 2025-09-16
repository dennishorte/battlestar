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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'Reformation')
    request = t.choose(game, request, 'Sailing')

    t.testIsFirstAction(request)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'Reformation')
    request = t.choose(game, request, 'Sailing')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        score: ['Reformation'],
        hand: ['Gunpowder', 'Enterprise'],
      },
    })
  })
})
