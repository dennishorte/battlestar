Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Al-Kindi', () => {
  test('inspire', () => {
    const game = t.fixtureTopCard('Al-Kindi', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', ['Tools', 'Writing'])
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.purple')
    request = t.choose(game, request, 'Writing')
    expect(t.cards(game, 'score')).toStrictEqual(['Writing'])
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
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Writing')

    expect(t.cards(game, 'hand').sort()).toStrictEqual(['Invention', 'Monotheism', 'Perspective', 'Yi Sun-Sin'])
  })
})
