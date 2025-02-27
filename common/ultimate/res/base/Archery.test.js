Error.stackTraceLimit = 100
const t = require('../../testutil.js')

describe('Archery', () => {
  test('dogma: demand effect transfers highest card', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Archery'],
        hand: [],
      },
      micah: {
        hand: ['Gunpowder', 'Currency'], // Age 4 and Age 3
      },
      decks: {
        base: {
          1: ['Tools'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Archery')

    t.testBoard(game, {
      dennis: {
        red: ['Archery'],
        hand: ['Gunpowder'],
      },
      micah: {
        hand: ['Currency', 'Tools'],
      }
    })
  })

  test('dogma: demand effect with no transferable cards', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Archery'],
        hand: [],
      },
      micah: {
        hand: [],
      },
      decks: {
        base: {
          1: ['Tools'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Archery')

    t.testBoard(game, {
      dennis: {
        red: ['Archery'],
        hand: ['Tools'],
      },
      micah: {
        hand: [],
      }
    })
  })

  test('dogma: junking age 1 achievement', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Archery'],
        hand: [],
      },
      achievements: ['The Wheel', 'Mathematics', 'Machinery', 'Navigation'],
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Archery')
    const request3 = t.choose(game, request2, '1')

    expect(game.getAvailableAchievementsByAge(1)).toHaveLength(0)
    expect(game.getAvailableAchievementsByAge(2)).toHaveLength(1)
  })

  test('dogma: junking age 2 achievement', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Archery'],
        hand: [],
      },
      achievements: ['The Wheel', 'Mathematics', 'Machinery', 'Navigation'],
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Archery')
    const request3 = t.choose(game, request2, '2')

    expect(game.getAvailableAchievementsByAge(1)).toHaveLength(1)
    expect(game.getAvailableAchievementsByAge(2)).toHaveLength(0)
  })

  test('dogma: no eligible achievements', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Archery'],
        hand: [],
      },
      achievements: ['Machinery', 'Navigation'],
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Archery')

    expect(game.getAvailableAchievementsByAge(3)).toHaveLength(1)
  })

  test('dogma: choosing between equal highest values', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Archery'],
        hand: [],
      },
      micah: {
        hand: ['Mathematics', 'Construction'], // Both Age 3
      },
      decks: {
        base: {
          1: ['Tools'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Archery')
    const request3 = t.choose(game, request2, 'Mathematics')

    t.testBoard(game, {
      dennis: {
        red: ['Archery'],
        hand: ['Mathematics'],
      },
      micah: {
        hand: ['Construction', 'Tools'],
      }
    })
  })
})



/* Error.stackTraceLimit = 100
 *
 * const t = require('../../testutil.js')
 *
 * describe('Archery', () => {
 *   test('returned none', () => {
 *     const game = t.fixtureTopCard('Archery')
 *     game.testSetBreakpoint('before-first-player', (game) => {
 *       t.clearHand(game, 'dennis')
 *       t.setHand(game, 'micah', ['Gunpowder'])
 *       t.setDeckTop(game, 'base', 1, ['Tools'])
 *     })
 *     const result1 = game.run()
 *     const result2 = t.choose(game, result1, 'Dogma.Archery')
 *
 *     expect(t.cards(game, 'hand')).toStrictEqual(['Gunpowder'])
 *     expect(t.cards(game, 'hand', 'micah')).toStrictEqual(['Tools'])
 *   })
 * }) */
