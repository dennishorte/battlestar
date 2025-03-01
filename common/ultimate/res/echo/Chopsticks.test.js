Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Chopsticks", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Chopsticks'],
      },
      decks: {
        base: {
          1: ['Tools'],
        },
      },
      achievements: [],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Chopsticks')
    request = t.choose(game, request, 'yes')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Chopsticks'],
        hand: ['Tools'],
      },
    })

    const ageOneAchievements = game
      .getZoneById('achievements')
      .cards()
      .filter(card => card.getAge() === 1)
      .length
    expect(ageOneAchievements).toBe(1)
  })

  test('dogma: do not do extra achievement', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Chopsticks'],
      },
      decks: {
        base: {
          1: ['Tools'],
        },
      },
      achievements: [],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Chopsticks')
    request = t.choose(game, request, 'no')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Chopsticks'],
        hand: ['Tools'],
      },
    })

    const ageOneAchievements = game
      .getZoneById('achievements')
      .cards()
      .filter(card => card.getAge() === 1)
      .length
    expect(ageOneAchievements).toBe(0)
  })
})
