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
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Antibiotics')
    const result3 = t.choose(game, result2)

    expect(t.cards(game, 'hand', 'dennis').sort()).toEqual(['Archery', 'Calendar', 'Mathematics'])
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
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Antibiotics')
    const result3 = t.choose(game, result2, 'Archery')

    expect(t.cards(game, 'hand', 'dennis').sort()).toEqual([
      'Calendar',
      'Mass Media',
      'Mathematics',
      'Socialism',
    ])
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
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Antibiotics')
    const result3 = t.choose(game, result2, 'Archery', 'Calendar', 'Mathematics')
    const result4 = t.choose(game, result3, 'auto')

    expect(t.cards(game, 'hand', 'dennis').sort()).toEqual([
      'Empiricism',
      'Mass Media',
      'Quantum Theory',
      'Socialism',
    ])
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
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Antibiotics')

    const bad = () => t.choose(game, result2, 'Archery', 'Calendar', 'Mathematics', 'Tools')

    expect(bad).toThrow(Error)
  })
})
