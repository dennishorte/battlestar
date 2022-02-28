Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Gunpowder', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Gunpowder'],
      },
      micah: {
        green: ['Sailing'],
        blue: ['Tools'],
        red: ['Construction'],
      },
      decks: {
        base: {
          2: ['Calendar']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Gunpowder')

    t.testChoices(request2, ['Tools', 'Construction'])

    const request3 = t.choose(game, request2, 'Tools')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        red: ['Gunpowder'],
        score: ['Tools', 'Calendar'],
      },
      micah: {
        green: ['Sailing'],
        red: ['Construction'],
      },
    })
  })

  test('dogma (no transfer)', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Gunpowder'],
      },
      micah: {
        green: ['Sailing'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Gunpowder')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Gunpowder'],
      },
      micah: {
        green: ['Sailing'],
      },
    })
  })
})
