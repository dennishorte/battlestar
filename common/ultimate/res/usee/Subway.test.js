Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Subway', () => {

  test('dogma: at least 7', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: {
          cards: ['Subway', 'Canning', 'Masonry', 'Fermenting', 'Machinery', 'Agriculture'],
          splay: 'left',
        }
      },
      decks: {
        base: {
          9: ['Computers'],
        },
        usee: {
          7: ['Mafia'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Subway')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: {
          cards: ['Subway', 'Canning', 'Masonry', 'Fermenting', 'Machinery', 'Agriculture', 'Mafia'],
          splay: 'left',
        },
        hand: ['Computers'],
      },
    })
  })

  test('dogma: at least 7 (but not visible)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Subway', 'Canning', 'Masonry', 'Fermenting', 'Machinery', 'Agriculture'],
      },
      decks: {
        base: {
          8: ['Flight'],
        },
        usee: {
          7: ['Mafia'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Subway')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        hand: ['Flight'],
      },
    })
  })

  test('dogma: only 6', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: {
          cards: ['Subway', 'Canning', 'Masonry', 'Fermenting', 'Machinery'],
          splay: 'left',
        }
      },
      decks: {
        base: {
          8: ['Flight'],
        },
        usee: {
          7: ['Mafia'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Subway')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        hand: ['Flight'],
      },
    })
  })

  test('Napoleon Bonaparte karma intercepts the tuck: dogma does nothing further', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Subway'],
        red: ['Napoleon Bonaparte'],
      },
      decks: {
        usee: { 7: ['Mafia'] },
        base: { 8: ['Flight'], 9: ['Computers'] },
      },
    })

    game.run()
    t.choose(game, 'Dogma.Subway')

    // Napoleon's karma melds Mafia instead of tucking. Mafia (yellow) is
    // not red/blue, so it isn't tucked. With no tucked card, Subway's
    // dogma should not continue — no junking, no follow-up draw.
    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Mafia', 'Subway'],
        score: ['Napoleon Bonaparte'],
      },
    })
  })

})
