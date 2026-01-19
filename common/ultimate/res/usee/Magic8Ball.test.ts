Error.stackTraceLimit = 100
import t from '../../testutil.js'
describe('Magic 8-Ball', () => {

  test('dogma: no {s}; no red/purple', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Magic 8-Ball'],
        green: ['Measurement'],
      },
      decks: {
        usee: {
          8: ['Handbag'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Magic 8-Ball')
    request = t.choose(game, request, 'Draw two 10')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Magic 8-Ball'],
        green: ['Measurement', 'Handbag'],
      },
    })
  })

  test('dogma: no {s}; red/purple', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Magic 8-Ball'],
      },
      decks: {
        base: {
          8: ['Corporations'],
        },
        usee: {
          8: ['Concealment'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Magic 8-Ball')
    request = t.choose(game, request, 'Draw two 10')
    request = t.choose(game, request, 'Draw two 10')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Magic 8-Ball'],
        green: ['Corporations'],
        red: ['Concealment'],
      },
    })
  })

  test('dogma: draw two 10', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Magic 8-Ball'],
      },
      decks: {
        base: {
          10: ['Robotics', 'Software'],
        },
        usee: {
          8: ['Scouting'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Magic 8-Ball')
    request = t.choose(game, request, 'Draw two 10')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Magic 8-Ball'],
        blue: ['Scouting'],
        hand: ['Robotics', 'Software'],
      },
    })
  })

  test('dogma: draw and score two 8', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Magic 8-Ball'],
      },
      decks: {
        base: {
          8: ['Flight', 'Corporations'],
        },
        usee: {
          8: ['Scouting'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Magic 8-Ball')
    request = t.choose(game, request, 'Draw and score two 8')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Magic 8-Ball'],
        blue: ['Scouting'],
        score: ['Flight', 'Corporations'],
      },
    })
  })

  test('dogma: safeguard two available standard achievements', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Magic 8-Ball'],
      },
      achievements: ['Tools', 'Optics'],
      decks: {
        usee: {
          8: ['Scouting'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Magic 8-Ball')
    request = t.choose(game, request, 'Safeguard two available standard achievements')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Magic 8-Ball'],
        blue: ['Scouting'],
        safe: ['Tools', 'Optics'],
      },
    })
  })

})
