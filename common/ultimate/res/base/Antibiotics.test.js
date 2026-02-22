Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Antibiotics', () => {
  test('returned none', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Antibiotics'],
        hand: ['Archery', 'Calendar', 'Mathematics'],
      },
    })
    game.run()
    t.choose(game, 'Dogma.Antibiotics')
    t.choose(game)  // Return nothing

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Antibiotics'],
        hand: ['Archery', 'Calendar', 'Mathematics'],
      },
    })
  })

  test('returned one', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Antibiotics'],
        hand: ['Archery', 'Calendar', 'Mathematics'],
      },
      decks: {
        base: {
          8: ['Socialism', 'Mass Media'],
        },
      },
    })
    game.run()
    t.choose(game, 'Dogma.Antibiotics')
    t.choose(game, 'Archery')  // Return 1 card (age 1) -> draw 2

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Antibiotics'],
        hand: ['Calendar', 'Mass Media', 'Mathematics', 'Socialism'],
      },
    })
  })

  test('returned three (two with same value)', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Antibiotics'],
        hand: ['Archery', 'Calendar', 'Mathematics'],
      },
      decks: {
        base: {
          8: ['Socialism', 'Mass Media', 'Empiricism', 'Quantum Theory'],
        },
      },
    })
    game.run()
    t.choose(game, 'Dogma.Antibiotics')
    t.choose(game, 'Archery', 'Calendar', 'Mathematics')  // 2 distinct ages -> draw 4
    t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Antibiotics'],
        hand: ['Empiricism', 'Mass Media', 'Quantum Theory', 'Socialism'],
      },
    })
  })

  test('four is too many', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Antibiotics'],
        hand: ['Archery', 'Calendar', 'Mathematics', 'Tools'],
      },
      decks: {
        base: {
          8: ['Socialism', 'Mass Media', 'Empiricism', 'Quantum Theory'],
        },
      },
    })
    game.run()
    const request = t.choose(game, 'Dogma.Antibiotics')

    t.testChoices(request, ['Archery', 'Calendar', 'Mathematics', 'Tools'], 0, 3)
  })
})
