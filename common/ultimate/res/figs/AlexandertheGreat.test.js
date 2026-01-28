Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Alexander the Great', () => {

  test('karma: meld-this', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        hand: ['Alexander the Great'],
      },
      micah: {
        purple: ['Homer'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Meld.Alexander the Great')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Alexander the Great'],
        score: ['Homer'],
      },
    })
  })

  test('karma: when-meld does not trigger when melding a different card', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Alexander the Great'],
        hand: ['Archery'],
      },
      micah: {
        purple: ['Homer'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Meld.Archery')

    // Homer should NOT be scored because melding Archery should not trigger
    // Alexander the Great's when-meld karma
    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Archery', 'Alexander the Great'],
      },
      micah: {
        purple: ['Homer'],
      },
    })
  })

  test('karma: dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Alexander the Great'],
        yellow: ['Agriculture'],
      },
      decks: {
        base: {
          2: ['Mapmaking'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Agriculture')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Alexander the Great'],
        yellow: ['Agriculture'],
        score: ['Mapmaking'],
      },
    })
  })

  test('karma: dogma, not a 2', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Alexander the Great'],
        yellow: ['Agriculture'],
      },
      decksExact: {
        base: {
          2: [],
          3: ['Machinery'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Agriculture')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Agriculture'],
        score: ['Machinery', 'Alexander the Great'],
      },
    })
  })

})
