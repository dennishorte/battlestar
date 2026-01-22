Error.stackTraceLimit = 100

const t = require('../../testutil.js')

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
    request = t.choose(game, 'dogma')
    request = t.choose(game, 'Domestication')

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
    request = t.choose(game, 'dogma')

    t.testGameOver(request, 'dennis', "Garland's Ruby Slippers")
  })
})
