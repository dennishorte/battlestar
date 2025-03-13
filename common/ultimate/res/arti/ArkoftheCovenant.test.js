Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Ark of the Covenant', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Ark of the Covenant'],
        yellow: ['Agriculture'],
        blue: ['Mathematics'],
        hand: ['Canning'],
      },
      micah: {
        yellow: ['Fermenting'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        blue: ['Mathematics'],
        score: ['Agriculture', 'Fermenting'],
      },
    })
  })

  test('dogma: ark on top', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Ark of the Covenant'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Ark of the Covenant')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        hand: ['Ark of the Covenant'],
      },
    })
  })
})
