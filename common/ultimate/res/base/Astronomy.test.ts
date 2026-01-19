Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Astronomy', () => {
  test('draw blue, green, other', () => {
    const game = t.fixtureTopCard('Astronomy')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.clearHand(game, 'dennis')
      t.setDeckTop(game, 'base', 6, ['Atomic Theory', 'Classification', 'Industrialization'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Astronomy')

    expect(t.cards(game, 'blue')).toEqual(['Atomic Theory'])
    expect(t.cards(game, 'green')).toEqual(['Classification'])
    expect(t.cards(game, 'hand')).toEqual(['Industrialization'])
  })

  test('win condition, yes', () => {
    const game = t.fixtureTopCard('Astronomy')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.clearHand(game, 'dennis')
      t.setDeckTop(game, 'base', 6, ['Atomic Theory', 'Classification', 'Industrialization'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Astronomy')

    expect(t.cards(game, 'achievements')).toEqual(['Universe'])
  })

  test('win condition, no', () => {
    const game = t.fixtureTopCard('Astronomy')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.clearHand(game, 'dennis')
      t.setDeckTop(game, 'base', 6, ['Atomic Theory', 'Classification', 'Industrialization'])
      t.setColor(game, 'dennis', 'yellow', ['Steam Engine'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Astronomy')

    expect(t.cards(game, 'achievements')).toEqual([])
  })
})
