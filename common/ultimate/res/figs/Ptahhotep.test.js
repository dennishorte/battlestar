Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Ptahhotep', () => {

  test('karma: first action does nothing', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['The Wheel'],
        purple: ['Ptahhotep'],
      },
      decks: {
        base: {
          1: ['Tools', 'Agriculture'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.The Wheel')

    t.testBoard(game, {
      dennis: {
        green: ['The Wheel'],
        purple: ['Ptahhotep'],
        hand: ['Tools', 'Agriculture'],
      },
    })
  })

  test('karma: no card in hand means nothing happens', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        hand: ['The Wheel'],
      },
      micah: {
        purple: ['Ptahhotep'],
        hand: ['Fermenting'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Meld.The Wheel')
    request = t.choose(game, 'Meld.Fermenting')
    request = t.choose(game, 'Dogma.Fermenting')

    t.testBoard(game, {
      dennis: {
        green: ['The Wheel'],
      },
      micah: {
        yellow: ['Fermenting'],
        purple: ['Ptahhotep'],
      },
    })
  })

  test('karma: score and execute', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        hand: ['Fermenting'],
      },
      micah: {
        purple: ['Ptahhotep'],
        hand: ['The Wheel', 'Sailing'],
      },
      decks: {
        base: {
          1: ['Tools', 'Agriculture'],
          2: ['Mapmaking'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Meld.Fermenting')
    request = t.choose(game, 'Meld.Sailing')
    request = t.choose(game, 'Dogma.Sailing')


    t.testBoard(game, {
      dennis: {
        yellow: ['Fermenting'],
      },
      micah: {
        green: ['Sailing'],
        purple: ['Ptahhotep'],
        hand: ['Tools', 'Agriculture'],
        score: ['The Wheel'],
      },
    })
  })
})
