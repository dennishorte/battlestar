Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Shigeru Miyamoto', () => {

  test('karma (win)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Shigeru Miyamoto'],
        green: ['Databases'],
        blue: ['Computers'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Databases')

    t.testGameOver(request, 'dennis', 'Shigeru Miyamoto')
  })

  test('karma (no win)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Shigeru Miyamoto'],
        green: ['Databases'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Databases')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Shigeru Miyamoto'],
        green: ['Databases'],
      },
    })
  })
})
