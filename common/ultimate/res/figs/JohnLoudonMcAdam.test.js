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

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.yellow')
    request = t.choose(game, request, 'Canning')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()

    t.testActionChoices(request, 'Achieve', ['age 1', 'age 2', 'Sparta'])
  })
})
