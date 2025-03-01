Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Florence Nightingale', () => {

  test('inspire', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Archery'],
        yellow: ['Florence Nightingale'],
        hand: ['Mathematics', 'Engineering']
      },
      decks: {
        base: {
          7: ['Lighting']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.yellow')
    request = t.choose(game, request, 'Engineering')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Archery', 'Engineering'],
        yellow: ['Florence Nightingale'],
        hand: ['Mathematics', 'Lighting']
      },
    })
  })

  test('karma: decree', () => {
    t.testDecreeForTwo('Florence Nightingale', 'Expansion')
  })

  test('karma: score pile', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Vaccination']
      },
      micah: {
        yellow: ['Florence Nightingale'],
        score: ['Mathematics', 'Enterprise']
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Vaccination')

    t.testIsSecondPlayer(game)
    t.setBoard(game, {
      dennis: {
        yellow: ['Vaccination']
      },
      micah: {
        yellow: ['Florence Nightingale'],
        score: ['Mathematics', 'Enterprise']
      }
    })
  })

  test('karma: score pile (own effect)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Florence Nightingale'],
        purple: ['Education'],
        score: ['Mathematics', 'Enterprise']
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Education')
    request = t.choose(game, request, 'yes')

    t.testIsSecondPlayer(game)
    t.setBoard(game, {
      dennis: {
        yellow: ['Florence Nightingale'],
        score: ['Mathematics', 'Enterprise'],
      },
    })
  })

  test('karma: vs Combustion', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Combustion'],
        green: ['Navigation'],
        purple: ['Enterprise'],
        score: ['Mathematics'],
      },
      micah: {
        yellow: ['Florence Nightingale'],
        score: ['Printing Press', 'Carl Friedrich Gauss', 'Canning'],
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Combustion')
    request = t.choose(game, request, 'Printing Press', 'Carl Friedrich Gauss')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.setBoard(game, {
      dennis: {
        purple: ['Enterprise'],
        score: ['Mathematics'],
      },
      micah: {
        yellow: ['Florence Nightingale'],
        score: ['Printing Press', 'Carl Friedrich Gauss', 'Canning'],
      }
    })
  })

  test('dogma: interaction with East India Company Charter', () => {

    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['East India Company Charter'],
        score: ['Construction', 'Tools', 'Gunpowder'],
      },
      micah: {
        yellow: ['Florence Nightingale'],
        score: ['Calendar', 'Fermenting', 'Engineering'],
      },
      decks: {
        base: {
          5: ['Astronomy'],
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 2)
    request = t.choose(game, request, 'auto')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        score: ['Tools', 'Gunpowder', 'Astronomy'],
      },
      micah: {
        yellow: ['Florence Nightingale'],
        score: ['Calendar', 'Fermenting', 'Engineering'],
      },
    })
  })
})
