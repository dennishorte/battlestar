const t = require('../../testutil.js')

describe('Writing', () => {
  test('draw a 2', () => {
    const game = t.fixtureTopCard('Writing')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setDeckTop(game, 'base', 2, ['Mathematics'])
    })
    const request = game.run()
    t.choose(game, request, 'Dogma.Writing')
    t.testZone(game, 'hand', ['Mathematics'])
  })
})
