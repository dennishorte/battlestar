Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Laser", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Laser'],
        score: ['Tools', 'Sailing', 'Domestication'],
      },
      decks: {
        base: {
          10: ['Robotics', 'Software'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Laser')
    const request3 = t.choose(game, request2, 'Tools', 'Sailing')
    const request4 = t.choose(game, request3, 'auto')


    t.testIsSecondPlayer(request4)
    t.testBoard(game, {
      dennis: {
        blue: ['Software', 'Laser'],
        red: ['Robotics'],
        score: ['Domestication'],
      },
    })

    const achievements = game
      .getZoneById('achievements')
      .cards()
      .filter(ach => !ach.isSpecialAchievement)
      .length
    expect(achievements).toBe(0)
  })
})
