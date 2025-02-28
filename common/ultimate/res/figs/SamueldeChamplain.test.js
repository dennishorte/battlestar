Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Samuel de Champlain', () => {

  test('inspire', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Samuel de Champlain'],
        hand: ['Coal'],
      },
      decks: {
        base: {
          5: ['Astronomy'],
          6: ['Canning'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.green')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Samuel de Champlain'],
        hand: ['Astronomy', 'Canning'],
      },
    })
  })

  test('karma: draw fifth', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Samuel de Champlain'],
        hand: ['Coal', 'Tools', 'Calendar', 'The Wheel', 'Construction'],
      },
      decks: {
        base: {
          5: ['Astronomy'],
          6: ['Canning'],
        },
      },
      achievements: ['Domestication', 'Banking', 'Democracy'],
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.green')
    const request3 = t.choose(game, request2, 'age 6')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Samuel de Champlain'],
        hand: ['Astronomy', 'Canning', 'Tools', 'Calendar', 'The Wheel', 'Construction'],
        achievements: ['Democracy'],
      },
    })
  })
})
