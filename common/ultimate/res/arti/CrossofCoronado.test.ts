Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Cross of Coronado', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Cross of Coronado'],
        hand: ['Mathematics', 'Archery', 'Domestication', 'Sailing', 'Enterprise'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testGameOver(request, 'dennis', 'Cross of Coronado')
  })

  test('dogma: no win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Cross of Coronado'],
        hand: ['Mathematics', 'Archery', 'Domestication', 'Sailing', 'Experimentation'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game,  {
      dennis: {
        hand: ['Mathematics', 'Archery', 'Domestication', 'Sailing', 'Experimentation'],
        museum: ['Museum 1', 'Cross of Coronado'],
      },
    })
  })
})
