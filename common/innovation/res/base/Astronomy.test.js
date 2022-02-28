Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Astronomy', () => {
  test('draw blue, green, other', () => {
    const game = t.fixtureTopCard('Astronomy')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.clearHand(game, 'dennis')
      t.setDeckTop(game, 'base', 6, ['Atomic Theory', 'Classification', 'Industrialization'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Astronomy')

    expect(t.cards(game, 'blue')).toStrictEqual(['Atomic Theory'])
    expect(t.cards(game, 'green')).toStrictEqual(['Classification'])
    expect(t.cards(game, 'hand')).toStrictEqual(['Industrialization'])
  })

  test('win condition, yes', () => {
    const game = t.fixtureTopCard('Astronomy')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.clearHand(game, 'dennis')
      t.setDeckTop(game, 'base', 6, ['Atomic Theory', 'Classification', 'Industrialization'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Astronomy')

    expect(t.cards(game, 'achievements')).toStrictEqual(['Universe'])
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

    expect(t.cards(game, 'achievements')).toStrictEqual([])
  })
})
