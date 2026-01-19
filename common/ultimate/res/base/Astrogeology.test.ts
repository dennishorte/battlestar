Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Astrogeology', () => {

  test('draw and reveal', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Astrogeology'],
        purple: ['Code of Laws', 'Monotheism', 'Lighting', 'Reformation', 'Mysticism'],
        hand: ['Agriculture', 'Domestication', 'The Wheel', 'Machinery', 'Machine Tools'],
      },
      decks: {
        base: {
          11: ['Whataboutism'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Astrogeology')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Astrogeology'],
        purple: {
          cards: ['Code of Laws', 'Monotheism', 'Lighting', 'Reformation'],
          splay: 'aslant',
        },
        hand: ['Agriculture', 'Domestication', 'The Wheel', 'Machinery', 'Machine Tools', 'Mysticism', 'Whataboutism'],
      },
    })
  })

  test('you win', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Astrogeology'],
        purple: ['Code of Laws', 'Monotheism', 'Lighting', 'Reformation', 'Mysticism'],
        hand: ['Agriculture', 'Domestication', 'The Wheel', 'Machinery', 'Machine Tools', 'Software'],
      },
      decks: {
        base: {
          11: ['Whataboutism'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Astrogeology')

    t.testBoard(game, {
      dennis: {
        red: ['Astrogeology'],
        purple: {
          cards: ['Code of Laws', 'Monotheism', 'Lighting', 'Reformation'],
          splay: 'aslant',
        },
        hand: ['Agriculture', 'Domestication', 'The Wheel', 'Machinery', 'Machine Tools', 'Software', 'Mysticism', 'Whataboutism'],
      },
    })

    t.testGameOver(request, 'dennis', 'Astrogeology')
  })
})
