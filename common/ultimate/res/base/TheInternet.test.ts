Error.stackTraceLimit = 100

import t from '../../testutil.js'

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.The Internet')
    request = t.choose(game, request, 'green')

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
