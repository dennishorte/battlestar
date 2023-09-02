Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('J.P. Morgan', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['J.P. Morgan', 'Calendar'],
        red: {
          cards: ['Archery', 'Coal'],
          splay: 'left'
        }
      },
    })

    const request1 = game.run()
    const request2 = game.respondToInputRequest({
      actor: 'dennis',
      title: 'Choose First Action',
      selection: [{
        title: 'Dogma',
        selection: ['J.P. Morgan']
      }],
    })

    t.testChoices(request2, ['green', 'red'])

    const request3 = t.choose(game, request2, 'green')

    t.testBoard(game, {
      dennis: {
        green: {
          cards: ['J.P. Morgan', 'Calendar'],
          splay: 'up'
        },
        red: {
          cards: ['Archery', 'Coal'],
          splay: 'left'
        }
      },
    })
  })

  test('karma: decree', () => {
    t.testDecreeForTwo('J.P. Morgan', 'Trade')
  })

  test('karma: biscuits', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: {
          cards: ['J.P. Morgan', 'Calendar'],
          splay: 'up'
        },
        red: {
          cards: ['Archery', 'Machine Tools'],
          splay: 'left'
        }
      },
    })

    const request1 = game.run()

    expect(game.getBiscuitsByPlayer(t.dennis(game))).toEqual({
      k: 2,
      s: 3,
      l: 4,
      c: 4,
      f: 1,
      i: 0,
    })
  })

})
