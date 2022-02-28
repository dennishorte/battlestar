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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Napoleon Bonaparte')

    t.testChoices(request2, ['Christiaan Huygens', 'Napoleon Bonaparte'])

    const request3 = t.choose(game, request2, 'Christiaan Huygens')

    t.testIsSecondPlayer(request3)
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Napoleon Bonaparte')
    const request3 = t.choose(game, request2, 'Christopher Polhem')
    const request4 = t.choose(game, request3, 'Canning')

    t.testIsSecondPlayer(request4)
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
