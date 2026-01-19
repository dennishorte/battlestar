Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Christopher Polhem', () => {


  test('karma: decree', () => {
    t.testDecreeForTwo('Christopher Polhem', 'Expansion')
  })

  test('karma: score with zero achievements', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Christopher Polhem'],
        red: ['Coal'],
        achievements: []
      },
    })

    let request
    request = game.run()

    expect(game.getScore(t.dennis(game))).toBe(0)
  })

  test('karma: score with one achievement', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Christopher Polhem'],
        red: ['Coal'],
        achievements: ['Tools']
      },
    })

    let request
    request = game.run()

    expect(game.getScore(t.dennis(game))).toBe(5)
  })

  test('karma: score with two achievements', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Christopher Polhem'],
        red: ['Coal'],
        achievements: ['Tools', 'Sailing']
      },
    })

    let request
    request = game.run()

    expect(game.getScore(t.dennis(game))).toBe(10)
  })
})
