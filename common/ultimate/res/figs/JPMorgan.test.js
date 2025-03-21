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

    let request
    request = game.run()
    request = game.respondToInputRequest({
      actor: 'dennis',
      title: 'Choose First Action',
      selection: [{
        title: 'Dogma',
        selection: ['J.P. Morgan']
      }],
    })

    t.testChoices(request, ['green', 'red'])

    request = t.choose(game, request, 'green')

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

    let request
    request = game.run()

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
