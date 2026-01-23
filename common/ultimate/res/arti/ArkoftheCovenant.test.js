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
    request = t.choose(game, 'dogma')
    request = t.choose(game, 'auto')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        blue: ['Mathematics'],
        score: ['Agriculture', 'Fermenting'],
        museum: ['Museum 1', 'Ark of the Covenant'],
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
    request = t.choose(game, 'Dogma.Ark of the Covenant')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        hand: ['Ark of the Covenant'],
      },
    })
  })
})
