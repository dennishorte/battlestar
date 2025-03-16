Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe('Destiny', () => {
  test('gained on the fifth card', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Pagoda'],
        forecast: [
          'Magnifying Glass',
          'Sandpaper',
          'Chintz',
          'Globe',
        ]
      },
      decks: {
        echo: {
          3: ['Novel'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Pagoda')

    t.testBoard(game, {
      dennis: {
        purple: ['Pagoda'],
        forecast: [
          'Magnifying Glass',
          'Sandpaper',
          'Chintz',
          'Globe',
          'Novel',
        ],
        achievements: ['Destiny'],
      }
    })
  })

  test('not gained on fourth card', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Pagoda'],
        forecast: [
          'Magnifying Glass',
          'Sandpaper',
          'Globe',
        ]
      },
      decks: {
        echo: {
          3: ['Novel'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Pagoda')

    t.testBoard(game, {
      dennis: {
        purple: ['Pagoda'],
        forecast: [
          'Magnifying Glass',
          'Sandpaper',
          'Globe',
          'Novel',
        ],
      }
    })
  })
})
