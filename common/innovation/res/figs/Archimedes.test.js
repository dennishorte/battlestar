Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Archimedes', () => {
  test('echo (plus karma on echo)', () => {
    const game = t.fixtureTopCard('Archimedes', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setDeckTop(game, 'base', 3, ['Machinery']) // Affected by his own karma.
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Archimedes')
    expect(t.cards(game, 'hand').sort()).toStrictEqual(['Machinery'])
  })

  test('karma: decree', () => {
    t.testDecreeForTwo('Archimedes', 'Advancement')
  })

  test('karma: effect age', () => {
    const game = t.fixtureTopCard('Archimedes', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'green', ['The Wheel'])
      t.setDeckTop(game, 'base', 2, ['Calendar', 'Construction'])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.The Wheel')

    expect(t.cards(game, 'hand').sort()).toStrictEqual(['Calendar', 'Construction'])
  })
})
