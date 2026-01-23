Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Clothing', () => {
  test('transfer a card', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        green: ['Clothing'],
        blue: ['Tools'],
        hand: ['Mathematics', 'Code of Laws'],
      },
      micah: {
        purple: ['Mysticism'],
      },
      decks: {
        base: {
          1: ['Writing', 'Archery'],
        },
      },
    })
    game.run()
    t.choose(game, 'Dogma.Clothing')

    t.testBoard(game, {
      dennis: {
        green: ['Clothing'],
        blue: ['Tools'],
        purple: ['Code of Laws'],
        hand: ['Mathematics'],
        score: ['Writing', 'Archery'],
      },
      micah: {
        purple: ['Mysticism'],
      },
    })
  })

})
