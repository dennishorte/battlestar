Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Nelson Mandela', () => {

  test('inspire', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Nelson Mandela'],
      },
      decks: {
        base: {
          9: ['Computers', 'Services']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.red')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Nelson Mandela'],
        blue: ['Computers'],
        hand: ['Services']
      },
    })
  })

  test('karma: no-fade', () => {
    t.testNoFade('Nelson Mandela')
  })

  test('karma: achievements', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: {
          cards: ['Nelson Mandela', 'Gilgamesh'],
          splay: 'right',
        },
        purple: ['Homer'],
        green: ['Hatshepsut'],
        yellow: ['Shennong'],
      },
    })

    const request1 = game.run()

    expect(game.getAchievementsByPlayer(t.dennis(game)).other.length).toBe(2)
  })
})
