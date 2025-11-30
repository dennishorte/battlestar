Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Saladin', () => {
  test('karma: decree', () => {
    t.testDecreeForTwo('Saladin', 'War')
  })

  test('karma: dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Saladin'],
        green: ['Mapmaking'],
        yellow: ['Masonry'],
      },
      micah: {
        green: ['The Wheel'],
        blue: ['Tools'],
        purple: ['Code of Laws'],
        score: ['Domestication'],
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Mapmaking')
    request = t.choose(game, request, 'auto')

    t.testBoard(game, {
      dennis: {
        red: ['Saladin'],
        green: ['Mapmaking'],
        yellow: ['Masonry'],
        score: ['The Wheel', 'Tools'],
      },
      micah: {
        purple: ['Code of Laws'],
        score: ['Domestication'],
      },
    })
  })
})
