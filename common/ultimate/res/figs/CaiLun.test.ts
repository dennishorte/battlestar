Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Cai Lun', () => {

  test('karma: score', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Cai Lun', 'Fermenting'],
        green: ['Clothing', 'Sailing'],
      },
      decks: {
        base: {
          1: ['Metalworking', 'Tools'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Clothing')

    t.testBoard(game, {
      dennis: {
        yellow: {
          cards: ['Cai Lun', 'Fermenting'],
          splay: 'left',
        },
        green: {
          cards: ['Clothing', 'Sailing'],
          splay: 'left',
        },
        score: ['Metalworking', 'Tools'],
      },
    })
  })

  test('karma: score (by other player)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Cai Lun', 'Fermenting'],
        green: ['Sailing'],
        hand: ['Mapmaking'],
      },
      micah: {
        red: ['Archery', 'Construction'],
        green: ['Clothing'],
      },
      decks: {
        base: {
          1: ['Metalworking'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Mapmaking')
    request = t.choose(game, request, 'Dogma.Clothing')

    t.testBoard(game, {
      dennis: {
        yellow: {
          cards: ['Cai Lun', 'Fermenting'],
          splay: 'left',
        },
        green: {
          cards: ['Mapmaking', 'Sailing'],
          splay: 'left',
        },
      },
      micah: {
        red: ['Archery', 'Construction'],
        green: ['Clothing'],
        score: ['Metalworking'],
      },
    })
  })

  test('karma: available achievements', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Cai Lun'],
        green: ['The Wheel'],
        score: ['Coal'],
      },
      achievements: ['Domestication'],
    })

    let request
    request = game.run()

    t.testActionChoices(request, 'Achieve', ['*base-1*', 'The Wheel'])
  })
})
