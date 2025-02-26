Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Cross of Coronado', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Cross of Coronado'],
        hand: ['Mathematics', 'Archery', 'Domestication', 'Sailing', 'Enterprise'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testGameOver(request2, 'dennis', 'Cross of Coronado')
  })

  test('dogma: no win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Cross of Coronado'],
        hand: ['Mathematics', 'Archery', 'Domestication', 'Sailing', 'Experimentation'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game,  {
      dennis: {
        hand: ['Mathematics', 'Archery', 'Domestication', 'Sailing', 'Experimentation'],
      },
    })
  })
})
