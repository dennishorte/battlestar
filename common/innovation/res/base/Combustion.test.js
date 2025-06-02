Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Combustion', () => {
  test('demand', () => {
    const game = t.fixtureTopCard('Combustion')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'red', ['Combustion', 'Construction'])
      t.setColor(game, 'dennis', 'green', ['Navigation'])
      t.setColor(game, 'dennis', 'blue', ['Translation'])
      t.setScore(game, 'micah', ['Tools', 'Calendar', 'Mathematics'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Combustion')

    t.testChoices(result2, ['Tools', 'Calendar', 'Mathematics'])
    expect(result2.selectors[0].count).toBe(2)

    const result3 = t.choose(game, result2, 'Tools', 'Calendar')
    const result4 = t.choose(game, result3, 'auto')

    expect(t.cards(game, 'score').sort()).toEqual(['Calendar', 'Tools'])
    expect(t.cards(game, 'score', 'micah')).toEqual(['Mathematics'])
  })

  test('return', () => {
    const game = t.fixtureTopCard('Combustion')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'red', ['Combustion', 'Construction'])
      t.setColor(game, 'dennis', 'green', ['Navigation'])
      t.setColor(game, 'dennis', 'blue', ['Translation'])
      t.setScore(game, 'micah', ['Tools', 'Calendar', 'Mathematics'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Combustion')
    const result3 = t.choose(game, result2, 'Tools', 'Calendar')
    const result4 = t.choose(game, result3, 'auto')

    expect(t.cards(game, 'red')).toEqual(['Combustion'])
    expect(game.getCardByName('Construction').zone).toBe('decks.base.2')
  })
})
