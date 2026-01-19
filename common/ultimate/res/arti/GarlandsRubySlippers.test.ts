Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe("Garland's Ruby Slippers", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Garland's Ruby Slippers"],
        hand: ['Quantum Theory', 'Domestication'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'Domestication')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        blue: ['Quantum Theory'],
        museum: ['Museum 1', "Garland's Ruby Slippers"],
      },
    })
  })

  test('dogma: you win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Garland's Ruby Slippers"],
        hand: ['Battleship Yamato'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testGameOver(request, 'dennis', "Garland's Ruby Slippers")
  })
})
