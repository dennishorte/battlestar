Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Along the River during the Qingming Festival', () => {

  test('dogma: yellow', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Along the River during the Qingming Festival'],
      },
      decks: {
        base: {
          4: ['Perspective'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        yellow: ['Perspective'],
      },
    })
  })

  test('dogma: purple', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Along the River during the Qingming Festival'],
      },
      decks: {
        base: {
          4: ['Enterprise'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        score: ['Enterprise'],
      },
    })
  })

  test('dogma, repeat', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Along the River during the Qingming Festival'],
      },
      decks: {
        base: {
          4: ['Experimentation', 'Perspective'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        yellow: ['Perspective'],
        hand: ['Experimentation'],
      },
    })
  })
})
