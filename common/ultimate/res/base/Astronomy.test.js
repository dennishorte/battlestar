Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Astronomy', () => {
  test('draw blue, green, other', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: ['Astronomy'],
      },
      decks: {
        base: {
          6: ['Atomic Theory', 'Classification', 'Industrialization'],
        },
      },
    })
    game.run()
    t.choose(game, 'Dogma.Astronomy')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Astronomy'],
        blue: ['Atomic Theory'],
        green: ['Classification'],
        hand: ['Industrialization'],
        achievements: ['Universe'],
      },
    })
  })

  test('win condition, yes', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: ['Astronomy'],
      },
      decks: {
        base: {
          6: ['Atomic Theory', 'Classification', 'Industrialization'],
        },
      },
    })
    game.run()
    t.choose(game, 'Dogma.Astronomy')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Astronomy'],
        blue: ['Atomic Theory'],
        green: ['Classification'],
        hand: ['Industrialization'],
        achievements: ['Universe'],
      },
    })
  })

  test('win condition, no', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: ['Astronomy'],
        yellow: ['Steam Engine'],
      },
      decks: {
        base: {
          6: ['Atomic Theory', 'Classification', 'Industrialization'],
        },
      },
    })
    game.run()
    t.choose(game, 'Dogma.Astronomy')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Astronomy'],
        yellow: ['Steam Engine'],
        blue: ['Atomic Theory'],
        green: ['Classification'],
        hand: ['Industrialization'],
      },
    })
  })
})
