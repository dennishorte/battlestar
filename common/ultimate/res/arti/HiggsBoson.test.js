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
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'yes')

    t.testIsFirstAction(request)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'no')
    request = t.choose(game, request, 'Canning')
    request = t.choose(game, request, 'Atomic Theory')
    request = t.choose(game, request, 'Sailing')
    request = t.choose(game, request, 'Experimentation')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        score: ['Atomic Theory', 'Experimentation', 'Canning', 'Agriculture', 'Sailing'],
      },
    })
  })
})
