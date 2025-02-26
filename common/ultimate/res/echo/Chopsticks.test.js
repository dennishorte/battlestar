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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Chopsticks')
    const request3 = t.choose(game, request2, 'yes')

    t.testIsSecondPlayer(request3)
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Chopsticks')
    const request3 = t.choose(game, request2, 'no')

    t.testIsSecondPlayer(request3)
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
