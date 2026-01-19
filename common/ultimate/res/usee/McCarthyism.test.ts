Error.stackTraceLimit = 100
import t from '../../testutil.js'
describe('McCarthyism', () => {

  test('dogma: socialism', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['McCarthyism'],
      },
      micah: {
        purple: ['Socialism'],
      },
      decks: {
        usee: {
          8: ['Handbag'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.McCarthyism')

    t.testGameOver(request, 'dennis', 'McCarthyism')
  })

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['McCarthyism', 'Metalworking'],
        purple: ['Railroad', 'Lighting'],
      },
      micah: {
      },
      decks: {
        usee: {
          8: ['Handbag'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.McCarthyism')
    request = t.choose(game, request, 'red')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['McCarthyism', 'Metalworking'],
          splay: 'up',
        },
        purple: ['Lighting'],
        score: ['Railroad'],
      },
      micah: {
        green: ['Handbag'],
      },
    })
  })

})
