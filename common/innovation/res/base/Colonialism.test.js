Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Colonialism', () => {
  test('dogma', () => {
    const game = t.fixtureTopCard('Colonialism')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'blue', ['Tools'])
      t.setDeckTop(game, 'base', 3, ['Translation', 'Education', 'Alchemy'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Colonialism')

    expect(t.cards(game, 'blue')).toEqual(['Tools', 'Translation'])
    expect(t.cards(game, 'purple')).toEqual(['Education'])
  })
})
