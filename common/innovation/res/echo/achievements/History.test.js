Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe('History', () => {
  test('four effects in one color', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'yellow', ['Chopsticks', 'Toothbrush', 'Deodorant'])
      t.setSplay(game, 'dennis', 'yellow', 'up')
      t.setHand(game, 'dennis', ['Barometer'])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Barometer')

    expect(t.cards(game, 'achievements')).toStrictEqual(['History'])
  })

  test('three effects in one color', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'yellow', ['Chopsticks', 'Toothbrush'])
      t.setSplay(game, 'dennis', 'yellow', 'up')
      t.setHand(game, 'dennis', ['Barometer'])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Barometer')

    expect(t.cards(game, 'achievements')).toStrictEqual([])
  })

  test('four effects spread across two colors', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'yellow', ['Chopsticks', 'Toothbrush', 'Deodorant'])
      t.setSplay(game, 'dennis', 'yellow', 'up')
      t.setHand(game, 'dennis', ['Toilet'])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Toilet')

    expect(t.cards(game, 'achievements')).toStrictEqual([])
  })
})
