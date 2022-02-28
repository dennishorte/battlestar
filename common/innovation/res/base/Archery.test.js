Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Archery', () => {
  test('returned none', () => {
    const game = t.fixtureTopCard('Archery')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.clearHand(game, 'dennis')
      t.setHand(game, 'micah', ['Gunpowder'])
      t.setDeckTop(game, 'base', 1, ['Tools'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Archery')

    expect(t.cards(game, 'hand')).toStrictEqual(['Gunpowder'])
    expect(t.cards(game, 'hand', 'micah')).toStrictEqual(['Tools'])
  })
})
