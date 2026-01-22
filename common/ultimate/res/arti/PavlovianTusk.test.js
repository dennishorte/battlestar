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

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testChoices(request, ['Experimentation', 'Perspective', 'Gunpowder'])

    request = t.choose(game, 'Perspective')

    t.testChoices(request, ['Experimentation', 'Gunpowder'])

    request = t.choose(game, 'Experimentation')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        green: ['Navigation'],
        hand: ['Gunpowder', 'Enterprise'],
        score: ['Experimentation'],
        museum: ['Museum 1', 'Pavlovian Tusk'],
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

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testChoices(request, ['Sailing', 'Tools', 'Archery'])

    request = t.choose(game, 'Archery')

    t.testChoices(request, ['Sailing', 'Tools'])

    request = t.choose(game, 'Tools')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        hand: ['Sailing', 'Enterprise'],
        score: ['Tools'],
        museum: ['Museum 1', 'Pavlovian Tusk'],
      },
    })
  })
})
