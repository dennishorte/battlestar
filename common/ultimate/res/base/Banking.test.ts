Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Banking', () => {
  test('card with a factory', () => {
    const game = t.fixtureTopCard('Banking')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'micah', 'red', ['Industrialization'])
      t.setColor(game, 'micah', 'blue', ['Chemistry'])
      t.setDeckTop(game, 'base', 5, ['Statistics'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Banking')

    expect(result2.selectors[0]).toEqual(expect.objectContaining({
      actor: 'micah',
      choices: expect.arrayContaining(['Industrialization', 'Chemistry'])
    }))

    const result3 = t.choose(game, result2, 'Chemistry')

    expect(t.cards(game, 'blue')).toEqual(['Chemistry'])
    expect(t.cards(game, 'score', 'micah')).toEqual(['Statistics'])
  })

  test('no draw and score if no card', () => {
    const game = t.fixtureTopCard('Banking')
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Banking')
    expect(t.cards(game, 'score', 'micah')).toEqual([])
  })

  test('splay', () => {
    const game = t.fixtureTopCard('Banking')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'green', ['Banking', 'The Wheel', 'Mapmaking'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Banking')

    expect(result2.selectors[0].choices).toEqual(['green'])
    expect(result2.selectors[0].min).toBe(0)
  })
})
