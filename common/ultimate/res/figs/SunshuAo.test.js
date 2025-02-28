Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Sunshu Ao', () => {

  test('inspire', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Sunshu Ao'],
        hand: ['Sailing'],
      },
      decks: {
        base: {
          1: ['Tools']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.yellow')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Sunshu Ao'],
        green: ['Sailing'],
        hand: ['Tools'],
      },
    })
  })

  test('karma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Sunshu Ao'],
        hand: ['Domestication', 'Clothing'],
      },
      decks: {
        base: {
          1: ['Tools', 'Archery']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.yellow')
    const request3 = t.choose(game, request2, 'Domestication')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Sunshu Ao'],
        green: ['Clothing'],
        hand: ['Domestication', 'Tools', 'Archery'],
      },
    })
  })
})
