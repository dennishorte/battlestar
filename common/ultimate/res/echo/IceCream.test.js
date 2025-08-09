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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Ice Cream')
    request = t.choose(game, request, 'yes')
    request = t.choose(game, request, 7)

    t.testIsSecondPlayer(game)
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
      .zones.byId('achievements')
      .cardlist()
      .filter(card => !card.isSpecialAchievement)
      .filter(card => card.getAge() === 7)
    expect(achievements.length).toBe(2)
  })
})
