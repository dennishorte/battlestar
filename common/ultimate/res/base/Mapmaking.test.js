Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Mapmaking', () => {
  test('demand', () => {
    const game = t.fixtureFirstPlayer({ numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        green: ['Mapmaking'],
      },
      micah: {
        score: ['The Wheel', 'Mathematics'],
      },
      scott: {
        score: ['Navigation'],
      },
      decks: {
        base: {
          1: ['Mysticism'],
        },
      },
    })

    game.run()
    t.choose(game, 'Dogma.Mapmaking')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Mapmaking'],
        score: ['The Wheel', 'Mysticism'],
      },
      micah: {
        score: ['Mathematics'],
      },
      scott: {
        score: ['Navigation'],
      },
    })
  })

  test('if a card was not transferred', () => {
    const game = t.fixtureFirstPlayer({ numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        green: ['Mapmaking'],
      },
      micah: {
        score: ['Mathematics'],
      },
      scott: {
        score: ['Navigation'],
      },
    })

    game.run()
    t.choose(game, 'Dogma.Mapmaking')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Mapmaking'],
      },
      micah: {
        score: ['Mathematics'],
      },
      scott: {
        score: ['Navigation'],
      },
    })
  })
})
