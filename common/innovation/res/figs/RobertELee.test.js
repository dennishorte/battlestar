Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Robert E. Lee', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Robert E. Lee'],
        purple: ['Services'],
      },
      micah: {
        yellow: ['Stem Cells'],
      },
      decks: {
        base: {
          5: ['Coal']
        }
      }
    })

    const request1 = game.run()
    const request2 = game.respondToInputRequest({
      actor: 'dennis',
      title: request1.selectors[0].title,
      selection: [{
        name: 'Dogma',
        selection: ['Robert E. Lee']
      }],
      key: request1.key
    })

    const request3 = t.choose(game, request2, 'Stem Cells')
    const request4 = t.choose(game, request3, 'dennis')

    t.testIsSecondPlayer(request4)
    t.testBoard(game, {
      dennis: {
        red: ['Robert E. Lee'],
        purple: ['Services'],
        yellow: ['Stem Cells']
      },
    })
  })

  test('karma: decree', () => {
    t.testDecreeForTwo('Robert E. Lee', 'War')
  })

  test('karma: achievements', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Robert E. Lee'],
        blue: {
          cards: ['Pottery', 'Calendar'],
          splay: 'up'
        },
        green: ['Clothing'],
        yellow: {
          cards: ['Agriculture', 'Fermenting', 'Antibiotics', 'Canal Building', 'Vaccination'],
          splay: 'up'
        }
      },
    })

    const request1 = game.run()

    const achs = game.getAchievementsByPlayer(t.dennis(game))
    expect(achs.other.length).toBe(2)
  })
})
