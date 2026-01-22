Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Tools', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game,  {
      dennis: {
        blue: ['Tools'],
        hand: ['Machinery', 'Fermenting', 'Sailing', 'Engineering'],
      },
      decks: {
        base: {
          1: ['Domestication', 'The Wheel', 'Mysticism'],
          3: ['Translation'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Tools')
    request = t.choose(game, 'yes')
    request = t.choose(game, 'Fermenting', 'Machinery', 'Sailing')
    request = t.choose(game, 'auto')
    request = t.choose(game, 'Engineering')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Translation', 'Tools'],
        hand: ['Domestication', 'The Wheel', 'Mysticism'],
      },
    })
  })
})
