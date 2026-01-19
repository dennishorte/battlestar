Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Publications', () => {

  test('dogma: send to junk', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Publications', 'Tools'],
        green: ['Sailing', 'Navigation', 'Databases', 'The Wheel'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Publications')
    request = t.choose(game, request, 'blue')
    request = t.choose(game, request, 'Monument')

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

    let request
    request = game.run()

    expect(game.cards.byId('Monument').zone.id).toEqual('junk')

    request = t.choose(game, request, 'Dogma.Publications')
    request = t.choose(game, request, 'blue')
    request = t.choose(game, request)
    request = t.choose(game, request, 'Monument')

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

    expect(game.cards.byId('Monument').zone.id).toEqual('achievements')
  })
})
