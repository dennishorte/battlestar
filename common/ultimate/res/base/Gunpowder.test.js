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

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Gunpowder')

    t.testChoices(request, ['Tools', 'Construction'])

    request = t.choose(game, 'Tools')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Gunpowder')

    t.testIsSecondPlayer(game)
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
