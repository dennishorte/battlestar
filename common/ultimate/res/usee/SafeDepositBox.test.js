Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Safe Deposit Box', () => {

  test('dogma: draw and junk', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Safe Deposit Box'],
      },
      decks: {
        base: {
          7: ['Lighting'],
        },
        usee: {
          7: ['Fortune Cookie'],
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Safe Deposit Box')
    request = t.choose(game, 'Draw and junk')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Safe Deposit Box'],
      },
      junk: ['Lighting', 'Fortune Cookie'],
    })
  })

  test('dogma: exchange', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Safe Deposit Box'],
        score: ['Optics', 'Tools'],
      },
      junk: ['Monument', 'The Wheel', 'Lighting'],
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Safe Deposit Box')
    request = t.choose(game, 'Exchange')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Safe Deposit Box'],
        score: ['The Wheel', 'Lighting'],
      },
      junk: ['Monument', 'Optics', 'Tools'],
    })
  })

})
