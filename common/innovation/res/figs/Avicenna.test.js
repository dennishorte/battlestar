Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Avicenna', () => {
  test('inspire', () => {
    const game = t.fixtureTopCard('Avicenna', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setDeckTop(game, 'base', 3, ['Machinery'])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.yellow')

    t.testZone(game, 'yellow', ['Avicenna', 'Machinery'])
  })

  test('karma decree', () => {
    t.testDecreeForTwo('Avicenna', 'Expansion')
  })

  test('karma no-fade', () => {
    t.testNoFade('Avicenna')
  })
})
