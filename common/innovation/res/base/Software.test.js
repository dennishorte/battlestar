Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Software', () => {
  test('dogma', () => {
    const game = t.fixtureTopCard('Software')
    game.testSetBreakpoint('before-first-player', (game) => {
      // First card will be scored.
      // Next two will be for draw and meld
      t.setDeckTop(game, 'base', 10, ['The Internet', 'Globalization', 'Stem Cells'])
      t.setHand(game, 'dennis', ['Gunpowder'])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Software')
    const request3 = t.choose(game, request2, 'yes')

    expect(t.cards(game, 'score').sort()).toStrictEqual(['Gunpowder', 'The Internet'])
    expect(t.cards(game, 'yellow')).toStrictEqual(['Stem Cells', 'Globalization'])
  })
})
