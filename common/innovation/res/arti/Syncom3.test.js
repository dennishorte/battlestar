Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Syncom 3", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Syncom 3"],
        hand: ['Code of Laws'],
      },
      decks: {
        base: {
          9: ['Services', 'Specialization', 'Satellites', 'Suburbia', 'Genetics']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        hand: ['Services', 'Specialization', 'Satellites', 'Suburbia', 'Genetics']
      }
    })
  })

  test('dogma: five colors', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Syncom 3"],
        hand: ['Code of Laws'],
      },
      decks: {
        base: {
          9: ['Fission', 'Specialization', 'Satellites', 'Suburbia', 'Genetics']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testGameOver(request2, 'dennis', 'Syncom 3')
  })
})
