Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe('Wonder Achievement', () => {
  test('achieved', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Flight', 'Archery'],
        yellow: {
          cards: ['Skyscrapers', 'Masonry'],
          splay: 'right',
        },
        green: {
          cards: ['Corporations', 'Sailing'],
          splay: 'right',
        },
        blue: {
          cards: ['Rocketry', 'Writing'],
          splay: 'up',
        },
        purple: {
          cards: ['Mysticism', 'Empiricism'],
          splay: 'right',
        },
      },
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Flight')
    request = t.choose(game, request, 'red')

    expect(t.cards(game, 'achievements')).toEqual(['Wonder'])
  })
})
