Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Albert Einstein', () => {
  test('echo', () => {
    const game = t.fixtureTopCard('Albert Einstein', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', ['Tools', 'Gunpowder', 'Databases'])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Albert Einstein')

    t.testChoices(request2, ['Tools', 'Databases'])
  })

  test('karma decree', () => {
    t.testDecreeForTwo('Albert Einstein', 'Advancement')
  })

  test('karma', () => {
    const game = t.fixtureTopCard('Albert Einstein', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'purple', ['Astronomy'])
      t.setDeckTop(game, 'base', 10, ['Robotics'])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Astronomy')

    t.testZone(game, 'hand', ['Robotics'])
  })
})
