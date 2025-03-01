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

    let request
    request = game.run()
    request = game.respondToInputRequest({
      actor: 'dennis',
      title: request.selectors[0].title,
      selection: [{
        title: 'Dogma',
        selection: ['Robert E. Lee']
      }],
    })

    request = t.choose(game, request, 'Stem Cells')
    request = t.choose(game, request, 'dennis')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()

    const achs = game.getAchievementsByPlayer(t.dennis(game))
    expect(achs.other.length).toBe(2)
  })
})
