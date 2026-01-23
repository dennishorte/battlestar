Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Homer', () => {

  test('karma: junk from hand', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs', 'city'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Agriculture'],
        blue: ['Atlantis'],
        purple: ['Homer'],
        hand: ['Shennong'],
      },
      decks: {
        base: {
          2: ['Mathematics'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Endorse.yellow')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Agriculture', 'Shennong'],
        blue: ['Mathematics'],
        purple: ['Homer'],
      },
    })
  })

  test('karma: junk non-figure from hand', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs', 'city'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Agriculture'],
        blue: ['Atlantis'],
        purple: ['Homer'],
        hand: ['Domestication'],
      },
      decks: {
        base: {
          2: ['Mathematics'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Endorse.yellow')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Agriculture'],
        blue: ['Mathematics'],
        purple: ['Homer'],
      },
      junk: ['Domestication'],
    })
  })

  test('karma: return from hand', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Agriculture'],
        blue: ['Tools'],
        purple: ['Homer'],
        hand: ['Shennong'],
      },
      decks: {
        base: {
          2: ['Mathematics'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Agriculture')
    request = t.choose(game, 'Shennong')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Agriculture', 'Shennong'],
        blue: ['Mathematics'],
        purple: ['Homer'],
      },
    })
  })

})
