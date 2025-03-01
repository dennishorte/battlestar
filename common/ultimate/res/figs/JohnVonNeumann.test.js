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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.John Von Neumann')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.John Von Neumann')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.John Von Neumann')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'Homer') // fade

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()

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
