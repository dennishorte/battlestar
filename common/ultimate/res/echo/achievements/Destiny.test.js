Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe('Destiny', () => {
  test('gained on the fifth card', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game, {
      dennis: {
        red: ['Bangle'],
        forecast: [
          'Magnifying Glass',
          'Sandpaper',
          'Chintz',
          'Globe',
        ]
      },
      decks: {
        echo: {
          2: ['Pagoda'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Bangle')

    t.testBoard(game, {
      dennis: {
        red: ['Bangle'],
        forecast: [
          'Magnifying Glass',
          'Sandpaper',
          'Chintz',
          'Globe',
          'Pagoda',
        ],
        achievements: ['Destiny'],
      }
    })
  })

  test('not gained on fourth card', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game, {
      dennis: {
        red: ['Bangle'],
        forecast: [
          'Magnifying Glass',
          'Sandpaper',
          'Globe',
        ]
      },
      decks: {
        echo: {
          2: ['Pagoda'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Bangle')

    t.testBoard(game, {
      dennis: {
        red: ['Bangle'],
        forecast: [
          'Magnifying Glass',
          'Sandpaper',
          'Globe',
          'Pagoda',
        ],
      }
    })
  })
})
