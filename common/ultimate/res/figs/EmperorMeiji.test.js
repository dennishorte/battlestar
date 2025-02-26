Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Emperor Meiji', () => {

  test('inspire (and forecast in hand karma)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Emperor Meiji'],
      },
      decks: {
        base: {
          7: ['Lighting'],
          8: ['Antibiotics']
        },
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.purple')
    const request3 = t.choose(game, request2, 8)

    t.testBoard(game, {
      dennis: {
        purple: ['Emperor Meiji'],
        hand: ['Lighting', 'Antibiotics'],
        forecast: ['Antibiotics']
      },
    })
  })

  test('karma: win (test 1)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Emperor Meiji'],
        yellow: ['Antibiotics'],
        blue: ['Computers'],
        hand: ['Software'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Software')

    t.testGameOver(request2, 'dennis', 'Emperor Meiji')
  })

  test('karma: win (test 2)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Emperor Meiji'],
        yellow: ['Antibiotics'],
        hand: ['Software'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Software')

    t.testNotGameOver()
  })

  test('karma: win (test 3)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Emperor Meiji'],
        yellow: ['Antibiotics'],
        blue: ['Computers'],
        hand: ['Flight'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Flight')

    t.testNotGameOver()
  })
})
