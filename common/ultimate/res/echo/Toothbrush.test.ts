Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe("Toothbrush", () => {

  test('dogma: not eligible', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Toothbrush'],
        hand: ['Tools', 'Sailing', 'Machinery'],
      },
      achievements: ['Philosophy'],
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
        green: ['Paper'],
        hand: ['Tools', 'Sailing', 'Machinery'],
        score: ['Software', 'Canning'],
      },
      junk: ['Engineering'],
      achievements: ['Philosophy'],
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
        green: ['Paper'],
        hand: ['Tools', 'Sailing'],
        score: ['Software', 'Canning'],
        achievements: ['Engineering'],
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


})
