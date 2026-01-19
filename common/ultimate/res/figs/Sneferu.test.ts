Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Sneferu', () => {

  test('karma: decree', () => {
    t.testDecreeForTwo('Sneferu', 'Expansion')
  })

  test('karma: meld with k', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Archery'],
        yellow: ['Sneferu'],
        hand: ['The Wheel'],
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

    t.testBoard(game, {
      dennis: {
        red: ['Archery', 'Construction'],
        green: ['The Wheel'],
        yellow: ['Sneferu'],
      },
    })
  })

  test('karma: meld without k', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Archery'],
        yellow: ['Sneferu'],
        hand: ['The Wheel'],
      },
      decks: {
        base: {
          2: ['Mathematics'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.The Wheel')

    t.testBoard(game, {
      dennis: {
        red: ['Archery'],
        green: ['The Wheel'],
        yellow: ['Sneferu'],
      },
    })
  })
})
