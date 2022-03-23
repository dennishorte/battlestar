Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Dunhuang Star Chart', () => {

  test('dogma: you win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Dunhuang Star Chart'],
        hand: ['Tools', 'The Wheel', 'Code of Laws', 'Experimentation', 'Calendar', 'Sailing'],
      },
      decks: {
        base: {
          6: ['Canning'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'auto')

    t.testIsFirstAction(request3)
    t.testBoard(game, {
      dennis: {
        hand: ['Canning'],
      },
    })
  })
})
