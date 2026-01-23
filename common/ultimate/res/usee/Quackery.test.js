Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Quackery', () => {

  test('dogma: score', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Quackery'],
        hand: ['Tools'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Quackery')
    request = t.choose(game, 'Score.Tools')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Quackery'],
        score: ['Tools']
      },
    })
  })

  test('dogma: draw', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Quackery'],
        hand: ['Tools'],
      },
      decks: {
        base: {
          3: ['Optics'],
        },
        usee: {
          4: ['Blackmail'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Quackery')
    request = t.choose(game, 'Draw a 4')
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Quackery'],
        hand: ['Optics']
      },
    })
  })

})
