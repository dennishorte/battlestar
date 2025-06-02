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

    expect(t.cards(game, 'achievements')).toEqual(['History'])
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

    expect(t.cards(game, 'achievements')).toEqual([])
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

    expect(t.cards(game, 'achievements')).toEqual([])
  })

  test('Hawking w/3 turtles', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'blue', ['Atomic Theory', 'Chemistry', 'Mathematics'])
      t.setSplay(game, 'dennis', 'blue', 'up')
      t.setHand(game, 'dennis', ['Stephen Hawking'])
    })

    t.choose(game, game.run(), 'Meld.Stephen Hawking')
    expect(t.cards(game, 'achievements')).toEqual([])
  })

  test('Hawking w/4 turtles', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'blue', ['Atomic Theory', 'Chemistry', 'Lever'])
      t.setSplay(game, 'dennis', 'blue', 'up')
      t.setHand(game, 'dennis', ['Stephen Hawking'])
    })

    t.choose(game, game.run(), 'Meld.Stephen Hawking')
    expect(t.cards(game, 'achievements')).toEqual(['History'])
  })

})
