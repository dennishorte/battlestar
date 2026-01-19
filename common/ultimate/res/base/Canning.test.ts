Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Canning', () => {
  test('draw and tuck a 6, yes', () => {
    const game = t.fixtureTopCard('Canning')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'red', ['Industrialization'])
      t.setColor(game, 'dennis', 'green', ['The Wheel'])
      t.setColor(game, 'dennis', 'blue', ['Chemistry'])
      t.setColor(game, 'dennis', 'purple', ['The Internet'])

      t.setDeckTop(game, 'base', 6, ['Vaccination'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Canning')
    const result3 = t.choose(game, result2, 'yes')
    const result4 = t.choose(game, result3, 'auto')
    const result5 = t.choose(game, result4, 'yellow')

    expect(t.cards(game, 'score').sort()).toEqual(['The Internet', 'The Wheel'])
    expect(t.cards(game, 'yellow').sort()).toEqual(['Canning', 'Vaccination'])
    expect(t.zone(game, 'yellow').splay).toBe('right')
  })

  test('draw and tuck a 6, no', () => {
    const game = t.fixtureTopCard('Canning')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'red', ['Industrialization'])
      t.setColor(game, 'dennis', 'green', ['The Wheel'])
      t.setColor(game, 'dennis', 'blue', ['Chemistry'])
      t.setColor(game, 'dennis', 'purple', ['The Internet'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Canning')
    const result3 = t.choose(game, result2, 'no')

    expect(t.cards(game, 'score').sort()).toEqual([])
    expect(t.cards(game, 'yellow').sort()).toEqual(['Canning'])
  })
})
