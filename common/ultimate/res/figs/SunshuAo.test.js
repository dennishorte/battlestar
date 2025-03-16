Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Sunshu Ao', () => {


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

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.yellow')
    request = t.choose(game, request, 'Domestication')

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
