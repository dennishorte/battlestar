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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Laser')
    request = t.choose(game, request, 'Tools', 'Sailing')
    request = t.choose(game, request, 'auto')


    t.testIsSecondPlayer(game)
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
