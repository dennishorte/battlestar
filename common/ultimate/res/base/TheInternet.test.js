Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('The Internet', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game,  {
      dennis: {
        purple: ['The Internet'],
        green: ['Databases', 'Navigation', 'Mapmaking'],
      },
      decks: {
        base: {
          10: ['Software', 'Robotics', 'Self Service'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.The Internet')
    const request3 = t.choose(game, request2, 'green')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['The Internet'],
        green: {
          cards: ['Self Service', 'Databases', 'Navigation', 'Mapmaking'],
          splay: 'up'
        },
        red: ['Robotics'],
        score: ['Software'],
      },
    })
  })
})
