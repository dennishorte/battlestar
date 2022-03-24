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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'yes')

    t.testIsFirstAction(request3)
    t.testBoard(game, {
      dennis: {
        score: ['Atomic Theory', 'Experimentation', 'Canning', 'Agriculture', 'Sailing'],
      },
    })
  })

  test('dogma: manual', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Higgs Boson'],
        blue: ['Atomic Theory', 'Experimentation'],
        yellow: ['Canning', 'Agriculture'],
        green: ['Sailing'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'no')
    const request4 = t.choose(game, request3, 'Canning')
    const request5 = t.choose(game, request4, 'Atomic Theory')
    const request6 = t.choose(game, request5, 'Sailing')
    const request7 = t.choose(game, request6, 'Experimentation')

    t.testIsFirstAction(request7)
    t.testBoard(game, {
      dennis: {
        score: ['Atomic Theory', 'Experimentation', 'Canning', 'Agriculture', 'Sailing'],
      },
    })
  })
})
