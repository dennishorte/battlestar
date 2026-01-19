Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Antibiotics', () => {
  test('returned none', () => {
    const game = t.fixtureTopCard('Antibiotics')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', ['Archery', 'Calendar', 'Mathematics'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Antibiotics')
    const result3 = t.choose(game, result2)

    expect(t.cards(game, 'hand', 'dennis').sort()).toEqual(['Archery', 'Calendar', 'Mathematics'])
  })

  test('returned one', () => {
    const game = t.fixtureTopCard('Antibiotics')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', ['Archery', 'Calendar', 'Mathematics'])
      t.setDeckTop(game, 'base', 8, [
        'Socialism',
        'Mass Media',
      ])
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
    const game = t.fixtureTopCard('Antibiotics')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', ['Archery', 'Calendar', 'Mathematics'])
      t.setDeckTop(game, 'base', 8, [
        'Socialism',
        'Mass Media',
        'Empiricism',
        'Quantum Theory',
      ])
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
    const game = t.fixtureTopCard('Antibiotics')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', ['Archery', 'Calendar', 'Mathematics', 'Tools'])
      t.setDeckTop(game, 'base', 8, [
        'Socialism',
        'Mass Media',
        'Empiricism',
        'Quantum Theory',
      ])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Antibiotics')

    const bad = () => t.choose(game, result2, 'Archery', 'Calendar', 'Mathematics', 'Tools')

    expect(bad).toThrow(Error)
  })
})
