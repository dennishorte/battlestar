Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Ice Cream", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Ice Cream'],
        yellow: ['Agriculture'],
        red: ['Candles'],
      },
      micah: {
      },
      decks: {
        base: {
          1: ['The Wheel'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Ice Cream')
    const request3 = t.choose(game, request2, 'yes')
    const request4 = t.choose(game, request3, 7)

    t.testIsSecondPlayer(request4)
    t.testBoard(game, {
      dennis: {
        purple: ['Ice Cream'],
        red: ['Candles'],
        score: ['Agriculture'],
      },
      micah: {
        green: ['The Wheel'],
      }
    })

    const achievements = game
      .getZoneById('achievements')
      .cards()
      .filter(card => !card.isSpecialAchievement)
      .filter(card => card.getAge() === 7)
    expect(achievements.length).toBe(2)
  })
})
