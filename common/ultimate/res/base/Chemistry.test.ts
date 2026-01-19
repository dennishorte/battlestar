Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Chemistry', () => {
  test('no splay, yes score', () => {
    const game = t.fixtureTopCard('Chemistry')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'blue', ['Chemistry', 'Tools'])

      t.setDeckTop(game, 'base', 6, ['Vaccination'])
      t.setScore(game, 'dennis', ['The Wheel'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Chemistry')
    const result3 = t.choose(game, result2)
    const result4 = t.choose(game, result3, 'The Wheel')

    expect(t.cards(game, 'score').sort()).toEqual(['Vaccination'])
    expect(t.zone(game, 'blue').splay).toBe('none')
  })

  test('yes splay, no score', () => {
    const game = t.fixtureTopCard('Chemistry')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'blue', ['Chemistry', 'Tools'])

      t.setDeckTop(game, 'base', 6, ['Vaccination'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Chemistry')
    const result3 = t.choose(game, result2, 'blue')

    expect(t.cards(game, 'score').sort()).toEqual([])
    expect(t.zone(game, 'blue').splay).toBe('right')
    expect(result3.selectors[0].actor).toBe('micah')
  })
})
