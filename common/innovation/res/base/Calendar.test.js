Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Calendar', () => {
  test('have more', () => {
    const game = t.fixtureTopCard('Calendar')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setScore(game, 'dennis', ['Printing Press', 'Invention', 'Experimentation'])
      t.setDeckTop(game, 'base', 3, ['Gunpowder', 'Paper'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Calendar')

    expect(t.cards(game, 'hand')).toStrictEqual(['Gunpowder', 'Paper'])
  })

  test('have less', () => {
    const game = t.fixtureTopCard('Calendar')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', ['Printing Press'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Calendar')

    expect(t.cards(game, 'hand')).toStrictEqual(['Printing Press'])
  })
})
