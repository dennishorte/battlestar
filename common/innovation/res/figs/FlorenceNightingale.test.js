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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.yellow')
    const request3 = t.choose(game, request2, 'Engineering')

    t.testIsSecondPlayer(request3)
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Vaccination')

    t.testIsSecondPlayer(request2)
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Education')
    const request3 = t.choose(game, request2, 'yes')

    t.testIsSecondPlayer(request3)
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Combustion')
    const request3 = t.choose(game, request2, 'Printing Press', 'Carl Friedrich Gauss')
    const request4 = t.choose(game, request3, 'auto')

    t.testIsSecondPlayer(request4)
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 2)
    const request4 = t.choose(game, request3, 'auto')

    t.testIsFirstAction(request4)
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
