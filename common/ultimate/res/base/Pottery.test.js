Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Pottery', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Pottery'],
        hand: ['Tools', 'Calendar', 'Sailing', 'Domestication'],
      },
      decks: {
        base: {
          1: ['Masonry'],
          2: ['Construction'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Pottery')

    t.testChoices(request, ['Tools', 'Calendar', 'Sailing', 'Domestication'], 0, 3)

    request = t.choose(game, 'Tools', 'Sailing')
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Pottery'],
        hand: ['Calendar', 'Domestication', 'Masonry'],
        score: ['Construction'],
      },
    })
  })

})
