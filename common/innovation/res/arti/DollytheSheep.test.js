Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Dolly the Sheep', () => {

  test('dogma: you win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Dolly the Sheep'],
        yellow: ['Statistics']
      },
      decks: {
        base: {
          1: ['Domestication']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'no')
    const request4 = t.choose(game, request3, 'yes')

    t.testGameOver(request4, 'dennis', 'Dolly the Sheep')
  })

  test('dogma: no win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Dolly the Sheep'],
        yellow: ['Statistics'],
        hand: ['Computers', 'Canning'],
      },
      decks: {
        base: {
          1: ['Sailing'],
          10: ['Software'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'no')
    const request4 = t.choose(game, request3, 'yes')

    t.testIsFirstAction(request4)
    t.testBoard(game, {
      dennis: {
        yellow: ['Statistics'],
        green: ['Sailing'],
        blue: ['Computers'],
        hand: ['Canning', 'Software'],
      }
    })
  })
})
