Error.stackTraceLimit = 100

import t from '../../testutil.js'

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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        hand: ['Services', 'Specialization', 'Satellites', 'Suburbia', 'Genetics'],
        museum: ['Museum 1', 'Syncom 3'],
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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testGameOver(request, 'dennis', 'Syncom 3')
  })
})
