Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('James Clerk Maxwell', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['James Clerk Maxwell'],
      },
      decks: {
        base: {
          7: ['Lighting'],
          8: ['Quantum Theory']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.blue')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        blue: ['James Clerk Maxwell'],
        hand: ['Lighting', 'Quantum Theory']
      },
    })
  })

  test('karma: biscuits', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['James Clerk Maxwell'],
        yellow: ['Alex Trebek'],
        hand: ['Tools', 'Calendar', 'Construction']
      },
    })

    const request1 = game.run()

    expect(game.getBiscuitsByPlayer(t.dennis(game))).toEqual({
      k: 0,
      s: 5,
      l: 0,
      c: 0,
      f: 0,
      i: 4,
    })
  })
})
