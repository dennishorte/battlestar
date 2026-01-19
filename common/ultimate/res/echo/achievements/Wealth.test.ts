Error.stackTraceLimit = 100

import t from '../../../testutil.js'

describe('Wealth', () => {
  test('eight visible bonuses', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'red', ['Plumbing'])
      t.setColor(game, 'dennis', 'green', ['Scissors'])
      t.setColor(game, 'dennis', 'blue', ['Perfume'])
      t.setColor(game, 'dennis', 'purple', ['Flute', 'Puppet'])
      t.setSplay(game, 'dennis', 'purple', 'up')

      t.setColor(game, 'dennis', 'yellow', ['Soap', 'Stove'])
      t.setSplay(game, 'dennis', 'yellow', 'up')

      t.setHand(game, 'dennis', ['Pencil'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Meld.Pencil')

    expect(t.cards(game, 'achievements')).toStrictEqual(['Wealth'])
  })

  test('seven visible bonuses', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'red', ['Plumbing'])
      t.setColor(game, 'dennis', 'green', ['Scissors'])
      t.setColor(game, 'dennis', 'purple', ['Flute', 'Puppet'])
      t.setSplay(game, 'dennis', 'purple', 'up')

      t.setColor(game, 'dennis', 'yellow', ['Soap', 'Stove'])
      t.setSplay(game, 'dennis', 'yellow', 'up')

      t.setHand(game, 'dennis', ['Pencil'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Meld.Pencil')

    expect(t.cards(game, 'achievements')).toStrictEqual([])
  })
})
