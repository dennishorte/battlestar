Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Alchemy', () => {
  test('draw and reveal (no red)', () => {
    const game = t.fixtureTopCard('Alchemy')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setDeckTop(game, 'base', 4, ['Printing Press', 'Invention', 'Experimentation'])
      t.setColor(game, 'dennis', 'green', ['The Wheel'])
      t.setColor(game, 'dennis', 'yellow', ['Masonry'])
      t.setColor(game, 'dennis', 'red', ['Metalworking'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Alchemy')
    const result3 = t.choose(game, result2, 'Invention')
    const result4 = t.choose(game, result3, 'Printing Press')

    expect(t.cards(game, 'green')).toStrictEqual(['Invention', 'The Wheel'])
    expect(t.cards(game, 'score')).toStrictEqual(['Printing Press'])
  })

  test('draw and reveal (red)', () => {
    const game = t.fixtureTopCard('Alchemy')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setDeckTop(game, 'base', 4, ['Printing Press', 'Gunpowder', 'Experimentation'])
      t.setColor(game, 'dennis', 'green', ['The Wheel'])
      t.setColor(game, 'dennis', 'yellow', ['Masonry'])
      t.setColor(game, 'dennis', 'red', ['Metalworking'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Alchemy')
    const result3 = t.choose(game, result2, 'auto')

    expect(t.cards(game, 'hand')).toStrictEqual([])
  })
})
