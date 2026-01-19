Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Clothing', () => {
  test('transfer a card', () => {
    const game = t.fixtureTopCard('Clothing')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', ['Mathematics', 'Code of Laws'])
      t.setColor(game, 'dennis', 'blue', ['Tools'])
      t.setColor(game, 'micah', 'purple', ['Mysticism'])
      t.setDeckTop(game, 'base', 1, ['Writing', 'Archery'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Clothing')

    expect(t.cards(game, 'purple')).toEqual(['Code of Laws'])
    expect(t.cards(game, 'score').sort()).toEqual(['Archery', 'Writing'])
  })

})
