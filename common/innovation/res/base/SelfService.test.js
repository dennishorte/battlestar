Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Self Service', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game,  {
      dennis: {
        green: ['Self Service'],
        blue: ['Computers', 'Tools'],
        yellow: ['Domestication'],
        hand: ['Canning'],
      },
      decks: {
        base: {
          1: ['The Wheel']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Self Service')

    t.testChoices(request2, ['Computers', 'Domestication'])

    const request3 = t.choose(game, request2, 'Domestication')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        green: ['Self Service'],
        blue: ['Computers', 'Tools'],
        yellow: ['Canning', 'Domestication'],
        hand: ['The Wheel'],
      }
    })
  })


  test('dogma (you win)', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game,  {
      dennis: {
        green: ['Self Service'],
        blue: ['Computers', 'Tools'],
        yellow: ['Domestication'],
        hand: ['Canning'],
        achievements: ['Sailing'],
      },
      decks: {
        base: {
          1: ['The Wheel']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Self Service')
    const request3 = t.choose(game, request2, 'Domestication')

    t.testGameOver(request3, 'dennis', 'Self Service')
  })
})
