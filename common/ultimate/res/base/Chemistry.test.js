Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Chemistry', () => {
  test('no splay, yes score', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Chemistry', 'Tools'],
        score: ['The Wheel'],
      },
      decks: {
        base: {
          6: ['Vaccination'],
        },
      },
    })
    game.run()
    t.choose(game, 'Dogma.Chemistry')
    t.choose(game)
    t.choose(game, 'The Wheel')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Chemistry', 'Tools'],
        score: ['Vaccination'],
      },
    })
  })

  test('yes splay, no score', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Chemistry', 'Tools'],
      },
      decks: {
        base: {
          6: ['Vaccination'],
        },
      },
    })
    game.run()
    t.choose(game, 'Dogma.Chemistry')
    const result = t.choose(game, 'blue')

    expect(result.selectors[0].actor).toBe('micah')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: {
          cards: ['Chemistry', 'Tools'],
          splay: 'right',
        },
      },
    })
  })
})
