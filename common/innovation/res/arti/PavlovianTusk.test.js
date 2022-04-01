Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Pavlovian Tusk", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Pavlovian Tusk"],
        green: ['Navigation'],
        hand: ['Enterprise'],
      },
      decks: {
        base: {
          4: ['Experimentation', 'Perspective', 'Gunpowder'],
        },
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testChoices(request2, ['Experimentation', 'Perspective', 'Gunpowder'])

    const request3 = t.choose(game, request2, 'Perspective')

    t.testChoices(request3, ['Experimentation', 'Gunpowder'])

    const request4 = t.choose(game, request3, 'Experimentation')

    t.testIsFirstAction(request4)
    t.testBoard(game, {
      dennis: {
        green: ['Navigation'],
        hand: ['Gunpowder', 'Enterprise'],
        score: ['Experimentation'],
      },
    })
  })

  test('dogma: no green card', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Pavlovian Tusk"],
        hand: ['Enterprise'],
      },
      decks: {
        base: {
          1: ['Sailing', 'Tools', 'Archery'],
        },
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testChoices(request2, ['Sailing', 'Tools', 'Archery'])

    const request3 = t.choose(game, request2, 'Archery')

    t.testChoices(request3, ['Sailing', 'Tools'])

    const request4 = t.choose(game, request3, 'Tools')

    t.testIsFirstAction(request4)
    t.testBoard(game, {
      dennis: {
        hand: ['Sailing', 'Enterprise'],
        score: ['Tools'],
      },
    })
  })
})
