Error.stackTraceLimit = 100

import t from '../../testutil.js'

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Satellites')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'purple')
    request = t.choose(game, request, 'Corporations')

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
