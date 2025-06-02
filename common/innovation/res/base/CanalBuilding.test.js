Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Canal Building', () => {
  test('transfer a card', () => {
    const game = t.fixtureTopCard('Canal Building')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', ['Industrialization', 'Tools'])
      t.setScore(game, 'dennis', ['Chemistry', 'Steam Engine', 'Colonialism'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Canal Building')
    const result3 = t.choose(game, result2, 'yes')

    expect(t.cards(game, 'score').sort()).toEqual(['Colonialism', 'Industrialization'])
    expect(t.cards(game, 'hand').sort()).toEqual(['Chemistry', 'Steam Engine', 'Tools'])
  })
})
