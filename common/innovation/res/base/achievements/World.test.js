Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe('World achievement', () => {
  test('12 biscuits', () => {
    const game = t.fixtureTopCard('Specialization')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'green', ['Databases'])
      t.setColor(game, 'dennis', 'blue', [
        'Software',
        'Bioengineering',
        'Computers',
        'Publications',
        'Rocketry',
        'Quantum Theory'
      ])
      t.setHand(game, 'dennis', [])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Specialization')
    const request3 = t.choose(game, request2, 'blue')

    expect(t.cards(game, 'achievements')).toEqual(['World'])
  })
})
