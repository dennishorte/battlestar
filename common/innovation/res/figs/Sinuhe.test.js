Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Sinuhe', () => {
  test('echo', () => {
    const game = t.fixtureTopCard('Sinuhe', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setDeckTop(game, 'base', 2, ['Mathematics'])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Sinuhe')

    t.testChoices(request2, [2, 3])

    const request3 = t.choose(game, request2, 2)

    t.testZone(game, 'forecast', ['Mathematics'])
  })

  test('decree karma', () => {
    t.testDecreeForTwo('Sinuhe', 'Rivalry')
  })

  test('score karma', () => {
    const game = t.fixtureTopCard('Sinuhe', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'green', ['The Wheel', 'Mapmaking'])
      t.setColor(game, 'dennis', 'blue', ['Tools',])
      t.setSplay(game, 'dennis', 'green', 'up')
    })
    const request1 = game.run()
    expect(game.getScore(t.dennis(game))).toBe(5)
  })
})
