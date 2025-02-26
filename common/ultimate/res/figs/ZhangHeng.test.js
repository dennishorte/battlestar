Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Zhang Heng', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Zhang Heng'],
        green: ['The Wheel', 'Sailing'],
      },
      decks: {
        base: {
          3: ['Compass']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Zhang Heng')


    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        blue: ['Zhang Heng'],
        green: ['Compass'],
        score: ['The Wheel', 'Sailing'],
      },
    })
  })

  test('karma: score', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Zhang Heng'],
        score: ['Robotics', 'Experimentation']
      },
    })

    const request1 = game.run()

    expect(game.getBonuses(t.dennis(game))).toStrictEqual([10, 4, 2])
  })
})
