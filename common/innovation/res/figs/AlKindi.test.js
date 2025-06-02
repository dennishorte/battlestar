Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Al-Kindi', () => {
  test('inspire', () => {
    const game = t.fixtureTopCard('Al-Kindi', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', ['Tools', 'Writing'])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.purple')
    const request3 = t.choose(game, request2, 'Writing')
    expect(t.cards(game, 'score')).toEqual(['Writing'])
  })

  test('karma', () => {
    const game = t.fixtureTopCard('Al-Kindi', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.clearHand(game, 'dennis')
      t.setColor(game, 'dennis', 'blue', ['Writing'])
      t.setColor(game, 'dennis', 'red', ['Gunpowder'])
      t.setColor(game, 'micah', 'blue', ['Tools'])
      t.setDeckTop(game, 'base', 4, ['Invention', 'Perspective'])
      t.setDeckTop(game, 'figs', 4, ['Yi Sun-Sin'])
      t.setDeckTop(game, 'base', 2, ['Calendar', 'Monotheism'])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Writing')

    expect(t.cards(game, 'hand').sort()).toEqual(['Invention', 'Monotheism', 'Perspective', 'Yi Sun-Sin'])
  })
})
