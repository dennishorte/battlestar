Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Nelson Mandela', () => {


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
