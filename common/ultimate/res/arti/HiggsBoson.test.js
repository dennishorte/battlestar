Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Higgs Boson', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Higgs Boson'],
        blue: ['Atomic Theory', 'Experimentation'],
        yellow: ['Canning', 'Agriculture'],
        green: ['Sailing'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')
    request = t.choose(game, 'auto')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        score: ['Atomic Theory', 'Experimentation', 'Canning', 'Agriculture', 'Sailing'],
        museum: ['Museum 1', 'Higgs Boson'],
      },
    })
  })
})
