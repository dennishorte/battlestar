Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Napoleon Bonaparte', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Napoleon Bonaparte'],
      },
      micah: {
        blue: ['Christiaan Huygens'],
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Napoleon Bonaparte')

    t.testChoices(request, ['Christiaan Huygens', 'Napoleon Bonaparte'])

    request = t.choose(game, request, 'Christiaan Huygens')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Napoleon Bonaparte'],
        score: ['Christiaan Huygens'],
      },
    })
  })

  test('karma: decree', () => {
    t.testDecreeForTwo('Napoleon Bonaparte', 'War')
  })

  test('karma: score', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Napoleon Bonaparte'],
        green: ['Corporations'],
        yellow: ['Fermenting'],
      },
      micah: {
        yellow: ['Christopher Polhem', 'Canning'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Napoleon Bonaparte')
    request = t.choose(game, request, 'Christopher Polhem')
    request = t.choose(game, request, 'Canning')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Napoleon Bonaparte'],
        green: ['Corporations'],
        yellow: ['Fermenting', 'Christopher Polhem'],
        score: ['Canning'],
      },
    })
  })
})
