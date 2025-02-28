Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Marie Curie', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Marie Curie'],
      },
      decks: {
        base: {
          9: ['Computers']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Marie Curie')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Marie Curie'],
        hand: ['Computers']
      },
    })
  })

  test('karma: achievements', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Marie Curie'],
        score: ['Computers', 'Lighting', 'Canning', 'Coal']
      },
    })

    const request1 = game.run()

    expect(game.getAchievementsByPlayer(t.dennis(game)).other.length).toBe(2)
  })
})
