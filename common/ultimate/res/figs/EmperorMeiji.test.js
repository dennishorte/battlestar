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

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.purple')
    request = t.choose(game, request, 8)

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Software')

    t.testGameOver(request, 'dennis', 'Emperor Meiji')
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Software')

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Flight')

    t.testNotGameOver()
  })
})
