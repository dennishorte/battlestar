Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('John Von Neumann', () => {

  test('echo (with purple)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['John Von Neumann'],
      },
      decks: {
        base: {
          9: ['Services', 'Satellites']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.John Von Neumann')
    const request3 = t.choose(game, request2, 'auto')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        red: ['John Von Neumann'],
      },
    })
  })

  test('echo (without purple)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['John Von Neumann'],
      },
      decks: {
        base: {
          9: ['Suburbia', 'Satellites']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.John Von Neumann')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        red: ['John Von Neumann'],
        hand: ['Suburbia', 'Satellites']
      },
    })
  })

  test('karma: when-meld', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Homer'],
        hand: ['John Von Neumann'],
      },
      micah: {
        yellow: ['Alex Trebek'],
        green: ['Fu Xi']
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.John Von Neumann')
    const request3 = t.choose(game, request2, 'auto')
    const request4 = t.choose(game, request3, 'Homer') // fade

    t.testIsSecondPlayer(request4)
    t.testBoard(game, {
      dennis: {
        score: ['Homer'],
        red: ['John Von Neumann'],
      },
    })
  })

  test('karma: biscuits', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['John Von Neumann'],
        hand: ['Tools', 'Calendar']
      },
    })

    const request1 = game.run()

    expect(game.getBiscuitsByPlayer(t.dennis(game))).toEqual({
      k: 0,
      s: 0,
      l: 0,
      c: 0,
      f: 0,
      i: 2 + 4,
    })
  })
})
