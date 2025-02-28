Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Publications', () => {

  test('dogma: send to junk', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Publications', 'Tools'],
        green: ['Sailing', 'Navigation', 'Databases', 'The Wheel'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Publications')
    const request3 = t.choose(game, request2, 'blue')
    const request4 = t.choose(game, request3, 'Monument')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: {
          cards: ['Publications', 'Tools'],
          splay: 'up',
        },
        green: ['Sailing', 'Navigation', 'Databases', 'The Wheel'],
      },
      junk: ['Monument']
    })
  })

  test('dogma: return from junk', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Publications', 'Tools'],
        green: ['Sailing', 'Navigation', 'Databases', 'The Wheel'],
      },
      junk: ['Monument'],
    })

    const request1 = game.run()

    expect(game.getCardByName('Monument').zone).toEqual('junk')

    const request2 = t.choose(game, request1, 'Dogma.Publications')
    const request3 = t.choose(game, request2, 'blue')
    const request4 = t.choose(game, request3)
    const request5 = t.choose(game, request4, 'Monument')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: {
          cards: ['Publications', 'Tools'],
          splay: 'up',
        },
        green: ['Sailing', 'Navigation', 'Databases', 'The Wheel'],
      },
      junk: [],
    })

    expect(game.getCardByName('Monument').zone).toEqual('achievements')
  })
})
