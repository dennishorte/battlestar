Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('City States', () => {
  test('transfer a card', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: ['City States'],
      },
      micah: {
        yellow: ['Masonry'],
        red: ['Archery'],
      },
      decks: {
        base: {
          1: ['Tools'],
        },
      },
    })
    game.run()
    t.choose(game, 'Dogma.City States')
    t.choose(game, 'Archery')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['City States'],
        red: ['Archery'],
      },
      micah: {
        yellow: ['Masonry'],
        hand: ['Tools'],
      },
    })
  })

  test('not enough castles', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: ['City States'],
      },
      micah: {
        yellow: ['Masonry'],
      },
    })
    game.run()
    const result = t.choose(game, 'Dogma.City States')

    expect(result.selectors[0].title).toBe('Choose First Action')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['City States'],
      },
      micah: {
        yellow: ['Masonry'],
      },
    })
  })
})
