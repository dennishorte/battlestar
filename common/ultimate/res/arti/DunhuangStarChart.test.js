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

    let request
    request = game.run()
    request = t.choose(game, 'dogma')
    request = t.choose(game, 'auto')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        hand: ['Canning'],
        museum: ['Museum 1', 'Dunhuang Star Chart'],
      },
    })
  })
})
