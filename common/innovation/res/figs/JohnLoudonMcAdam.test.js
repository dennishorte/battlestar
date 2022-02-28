Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('John Loudon McAdam', () => {

  test('inspire', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['John Loudon McAdam'],
        hand: ['Tools', 'Canning']
      },
      decks: {
        base: {
          6: ['Industrialization']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.yellow')
    const request3 = t.choose(game, request2, 'Canning')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        yellow: ['Canning', 'John Loudon McAdam'],
        hand: ['Industrialization', 'Tools']
      },
    })
  })

  test('karma: decree', () => {
    t.testDecreeForTwo('John Loudon McAdam', 'Expansion')
  })

  test('karma: achievements', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs', 'city'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['John Loudon McAdam'],
        red: ['Sparta'],
        score: ['Software']
      },
      achievements: ['The Wheel', 'Calendar', 'Machinery'],
    })

    const request1 = game.run()

    t.testActionChoices(request1, 'Achieve', ['age 1', 'age 2', 'Sparta'])
  })
})
