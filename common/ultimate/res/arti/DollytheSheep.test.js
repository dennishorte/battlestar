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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'no')
    request = t.choose(game, request, 'yes')

    t.testGameOver(request, 'dennis', 'Dolly the Sheep')
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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'no')
    request = t.choose(game, request, 'yes')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        yellow: ['Statistics'],
        green: ['Sailing'],
        blue: ['Computers'],
        hand: ['Canning', 'Software'],
        museum: ['Museum 1', 'Dolly the Sheep'],
      }
    })
  })
})
