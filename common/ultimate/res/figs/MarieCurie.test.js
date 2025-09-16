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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Marie Curie')

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

    let request
    request = game.run()

    expect(game.getAchievementsByPlayer(t.dennis(game)).other.length).toBe(2)
  })
})
