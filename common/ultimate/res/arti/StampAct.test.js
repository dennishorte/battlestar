Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Stamp Act", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Stamp Act"],
      },
      micah: {
        blue: ['Writing'],
        yellow: ['Fermenting'],
        green: ['Paper'],
        score: ['Tools', 'Calendar', 'Machinery', 'Gunpowder'],
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        score: ['Calendar'],
      },
      micah: {
        blue: ['Writing'],
        yellow: ['Fermenting'],
        green: ['Paper'],
        score: ['Tools', 'Gunpowder'],
      }
    })
  })

  test('dogma: no yellow', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Stamp Act"],
      },
      micah: {
        blue: ['Writing'],
        green: ['Paper'],
        score: ['Tools', 'Calendar', 'Machinery', 'Gunpowder'],
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      micah: {
        blue: ['Writing'],
        green: ['Paper'],
        score: ['Tools', 'Calendar', 'Machinery', 'Gunpowder'],
      }
    })
  })

  test('dogma: no green', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Stamp Act"],
      },
      micah: {
        blue: ['Writing'],
        yellow: ['Fermenting'],
        score: ['Tools', 'Calendar', 'Machinery', 'Gunpowder'],
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        score: ['Calendar'],
      },
      micah: {
        blue: ['Writing'],
        yellow: ['Fermenting'],
        score: ['Tools', 'Machinery', 'Gunpowder'],
      }
    })
  })
})
