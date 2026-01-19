Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Sargon of Akkad', () => {
  test('karma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Agriculture'],
        green: ['Sargon of Akkad'],
        hand: ['Tools'],
      },
      micah: {
        hand: ['Construction'],
      },
      decks: {
        base: {
          2: ['Mapmaking'],
          3: ['Machinery'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Agriculture')
    request = t.choose(game, request, 'Construction')
    request = t.choose(game, request, 'Tools')

    t.setBoard(game, {
      dennis: {
        yellow: ['Agriculture'],
        green: ['Sargon of Akkad'],
        score: ['Mapmaking'],
      },
      micah: {
        score: ['Machinery'],
      },
    })
  })
})
