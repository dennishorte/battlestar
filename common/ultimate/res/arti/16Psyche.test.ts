Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe("16 Psyche", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["16 Psyche"],
        blue: ['Software'],
      },
      junk: ['Domestication', 'Construction', 'Machinery', 'Hypersonics']
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testChoices(request, [1,2,3,4,5,6,7,8,9,11])

    request = t.choose(game, request, 11)

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        blue: ['Software'],
        museum: ['Museum 1', "16 Psyche"],
        score: [
          "Astrogeology",
          "Climatology",
          "Escapism",
          "Fusion",
          "Hypersonics",
          "Near-Field Comm",
          "Reclamation",
          "Solar Sailing",
          "Space Traffic",
          "Whataboutism",
        ],
      },
      junk: ['Domestication', 'Construction', 'Machinery']
    })
  })
})
