Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Collaboration', () => {
  test('demand', () => {
    const game = t.fixtureTopCard('Collaboration')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setDeckTop(game, 'base', 9, ['Computers', 'Services'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Collaboration')
    const result3 = t.choose(game, result2, 'Computers')

    expect(t.cards(game, 'blue')).toEqual(['Computers'])
    expect(t.cards(game, 'purple', 'micah')).toEqual(['Services'])
  })

  test('win condition (10)', () => {
    const game = t.fixtureTopCard('Collaboration')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setDeckTop(game, 'base', 9, ['Computers', 'Services'])
      t.setColor(game, 'dennis', 'green', [
        'Collaboration',
        'Mapmaking',
        'Banking',
        'Navigation',
        'Databases',

        'Sailing',
        'Paper',
        'Satellites',
        'Clothing',
        'Currency',
      ])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Collaboration')
    const result3 = t.choose(game, result2, 'Computers')

    t.testGameOver(result3, 'dennis', 'Collaboration')
  })
})
