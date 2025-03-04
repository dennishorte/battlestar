Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Secret Police', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Secret Police'],
        hand: ['Tools', 'Writing', 'Agriculture'],
      },
      micah: {
        yellow: ['Domestication'],
        hand: ['Mathematics', 'Masonry', 'Paper'],
      },
      decks: {
        usee: {
          3: ['Knights Templar'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Secret Police')
    request = t.choose(game, request, 'Mathematics')
    request = t.choose(game, request, 'Masonry')
    request = t.choose(game, request, 'Agriculture', 'Writing')  // Test guard
    request = t.choose(game, request, 'Tools', 'Writing')
    request = t.choose(game, request, 'Tools')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Secret Police'],
        blue: ['Tools', 'Writing'],
        hand: ['Agriculture'],
      },
      micah: {
        yellow: ['Masonry'],
        hand: ['Knights Templar'],
      },
    })
  })

})
