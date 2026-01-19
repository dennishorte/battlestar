Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('City States', () => {
  test('transfer a card', () => {
    const game = t.fixtureTopCard('City States')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'micah', 'yellow', ['Masonry'])
      t.setColor(game, 'micah', 'red', ['Archery'])
      t.setHand(game, 'micah', [])
      t.setDeckTop(game, 'base', 1, ['Tools'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.City States')
    const result3 = t.choose(game, result2, 'Archery')

    expect(t.cards(game, 'red')).toEqual(['Archery'])
    expect(t.cards(game, 'hand', 'micah')).toEqual(['Tools'])
  })

  test('not enough castles', () => {
    const game = t.fixtureTopCard('City States')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'micah', 'yellow', ['Masonry'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.City States')

    expect(result2.selectors[0].title).toBe('Choose First Action')
  })
})
