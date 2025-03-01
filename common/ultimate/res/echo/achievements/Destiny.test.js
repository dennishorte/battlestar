Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe('Destiny', () => {
  test('gained on the seventh card', () => {
    const game = t.fixtureTopCard('Bangle', { expansions: ['base', 'echo'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', [])
      t.setForecast(game, 'dennis', [
        'Magnifying Glass',
        'Sandpaper',
        'Chintz',
        'Globe',
        'Clock',
        'Shuriken',
      ])
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Bangle')

    expect(t.cards(game, 'achievements')).toStrictEqual(['Destiny'])
  })

  test('not gained on sixth card', () => {
    const game = t.fixtureTopCard('Bangle', { expansions: ['base', 'echo'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', [])
      t.setForecast(game, 'dennis', [
        'Magnifying Glass',
        'Sandpaper',
        'Chintz',
        'Clock',
        'Shuriken',
      ])
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Bangle')

    expect(t.cards(game, 'achievements')).toStrictEqual([])
  })
})
