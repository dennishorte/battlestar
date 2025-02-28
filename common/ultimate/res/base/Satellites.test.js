Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Satellites', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Code of Laws', 'Mysticism'],
        green: ['Satellites'],
        hand: ['Tools', 'Calendar'],
      },
      decks: {
        base: {
          8: ['Empiricism', 'Antibiotics', 'Corporations', 'Skyscrapers']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Satellites')
    const request3 = t.choose(game, request2, 'auto')
    const request4 = t.choose(game, request3, 'purple')
    const request5 = t.choose(game, request4, 'Corporations')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Code of Laws', 'Mysticism'],
          splay: 'up'
        },
        yellow: ['Skyscrapers'],
        green: ['Corporations', 'Satellites'],
        hand: ['Empiricism', 'Antibiotics']
      },
    })
  })

})
