Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Avicenna', () => {
  test('inspire', () => {
    const game = t.fixtureTopCard('Avicenna', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setDeckTop(game, 'base', 3, ['Machinery'])
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.yellow')

    t.testZone(game, 'yellow', ['Avicenna', 'Machinery'])
  })

  test('karma decree', () => {
    t.testDecreeForTwo('Avicenna', 'Expansion')
  })

  test('karma no-fade', () => {
    t.testNoFade('Avicenna')
  })
})
