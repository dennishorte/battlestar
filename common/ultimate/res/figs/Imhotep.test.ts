Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Imhotep', () => {

  test('karma: first action does nothing', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['The Wheel'],
        blue: ['Imhotep'],
      },
      decks: {
        base: {
          1: ['Tools', 'Agriculture'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.The Wheel')

    t.testBoard(game, {
      dennis: {
        green: ['The Wheel'],
        blue: ['Imhotep'],
        hand: ['Tools', 'Agriculture'],
      },
    })
  })

  test('karma: second action age 2 does nothing', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        hand: ['The Wheel'],
      },
      micah: {
        blue: ['Imhotep'],
        hand: ['Fermenting'],
      },
      decks: {
        base: {
          2: ['Construction'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.The Wheel')
    request = t.choose(game, request, 'Meld.Fermenting')
    request = t.choose(game, request, 'Dogma.Fermenting')

    t.testBoard(game, {
      dennis: {
        green: ['The Wheel'],
      },
      micah: {
        yellow: ['Fermenting'],
        blue: ['Imhotep'],
        hand: ['Construction'],
      },
    })
  })

  test('karma: second action age 1', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Paper'],
        hand: ['Fermenting'],
      },
      micah: {
        green: ['Sailing'],
        blue: ['Imhotep'],
        hand: ['The Wheel'],
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
    request = t.choose(game, request, 'Meld.Fermenting')
    request = t.choose(game, request, 'Meld.The Wheel')
    request = t.choose(game, request, 'Dogma.The Wheel')
    request = t.choose(game, request, 'auto')


    t.testBoard(game, {
      dennis: {
        yellow: ['Fermenting'],
      },
      micah: {
        green: {
          cards: ['The Wheel', 'Sailing'],
          splay: 'left',
        },
        blue: ['Imhotep'],
        hand: ['Tools', 'Agriculture'],
      },
    })
  })
})
