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

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.red')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()

    expect(game.getAchievementsByPlayer(t.dennis(game)).other.length).toBe(2)
  })
})
