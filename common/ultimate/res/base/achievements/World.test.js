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
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Specialization')
    request = t.choose(game, request, 'blue')

    expect(t.cards(game, 'achievements')).toStrictEqual(['World'])
  })
})
