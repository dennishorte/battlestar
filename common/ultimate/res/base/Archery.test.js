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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Archery')

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Archery')

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Archery')
    request = t.choose(game, request, '**base-1*')

    expect(game.getAvailableAchievementsByAge(t.dennis(game), 1)).toHaveLength(0)
    expect(game.getAvailableAchievementsByAge(t.dennis(game), 2)).toHaveLength(1)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Archery')
    request = t.choose(game, request, '**base-2*')

    expect(game.getAvailableAchievementsByAge(t.dennis(game), 1)).toHaveLength(1)
    expect(game.getAvailableAchievementsByAge(t.dennis(game), 2)).toHaveLength(0)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Archery')

    expect(game.getAvailableAchievementsByAge(t.dennis(game), 3)).toHaveLength(1)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Archery')
    request = t.choose(game, request, 'Mathematics')

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
