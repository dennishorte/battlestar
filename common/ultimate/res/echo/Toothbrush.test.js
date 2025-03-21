Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Toothbrush", () => {

  test('dogma: not eligible', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Toothbrush'],
        hand: ['Tools', 'Sailing', 'Machinery'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Toothbrush')

    t.testChoices(request, [1, 3])

    request = t.choose(game, request, 3)
    request = t.choose(game, request, 'yellow')
    request = t.choose(game, request, 'yes')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: {
          cards: ['Toothbrush', 'Machinery'],
          splay: 'left'
        },
        hand: ['Tools', 'Sailing'],
      },
      junk: [
        "Calendar",
        "Canal Building",
        "Construction",
        "Currency",
        "Fermenting",
        "Mapmaking",
        "Mathematics",
        "Monotheism",
        "Road Building",
      ],
    })
  })

  test('dogma: eligible', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Toothbrush'],
        hand: ['Tools', 'Sailing', 'Machinery'],
        score: ['Software'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Toothbrush')

    t.testChoices(request, [1, 3])

    request = t.choose(game, request, 3)
    request = t.choose(game, request, 'yellow')
    request = t.choose(game, request, 'yes')
    request = t.choose(game, request, '**base-2*')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: {
          cards: ['Toothbrush', 'Machinery'],
          splay: 'left'
        },
        hand: ['Tools', 'Sailing'],
        score: ['Software'],
        achievements: ['Calendar'],
      },
      junk: [
        "Canal Building",
        "Construction",
        "Currency",
        "Fermenting",
        "Mapmaking",
        "Mathematics",
        "Monotheism",
        "Road Building",
      ],
    })
  })


})
