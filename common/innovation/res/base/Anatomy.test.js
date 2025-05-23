Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Anatomy', () => {
  test('returned, matching top card', () => {
    const game = t.fixtureTopCard('Anatomy')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setScore(game, 'micah', ['Mathematics', 'The Wheel'])
      t.setColor(game, 'micah', 'red', ['Archery'])
      t.setColor(game, 'micah', 'blue', ['Calendar'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Anatomy')
    const result3 = t.choose(game, result2, 'The Wheel') // Micah's choice

    expect(t.cards(game, 'score', 'micah')).toEqual(['Mathematics'])
    expect(t.cards(game, 'red', 'micah')).toEqual([])
    expect(t.cards(game, 'blue', 'micah')).toEqual(['Calendar'])
  })

  test('returned, no matching top card', () => {
    const game = t.fixtureTopCard('Anatomy')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setScore(game, 'micah', ['Mathematics', 'The Wheel'])
      t.setColor(game, 'micah', 'red', ['Gunpowder', 'Archery'])
      t.setColor(game, 'micah', 'blue', ['Calendar'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Anatomy')
    const result3 = t.choose(game, result2, 'The Wheel') // Micah's choice

    expect(t.cards(game, 'score', 'micah')).toEqual(['Mathematics'])
    expect(t.cards(game, 'red', 'micah')).toEqual(['Gunpowder', 'Archery'])
    expect(t.cards(game, 'blue', 'micah')).toEqual(['Calendar'])
  })

  test('did not return', () => {
    const game = t.fixtureTopCard('Anatomy')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'micah', 'red', ['Archery'])
      t.setColor(game, 'micah', 'blue', ['Calendar'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Anatomy')

    expect(t.cards(game, 'red', 'micah')).toEqual(['Archery'])
    expect(t.cards(game, 'blue', 'micah')).toEqual(['Calendar'])
    expect(result2.selectors[0].title).toBe('Choose First Action')
  })
})
