Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('John Loudon McAdam', () => {


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
