Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe("Calculator", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Calculator', 'Tools'],
        green: ['Navigation', 'Paper', 'Sailing'],
        yellow: ['Agriculture', 'Canning'],
      },
      decks: {
        echo: {
          4: ['Shuriken'],
          7: ['Rubber'],
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Calculator')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'blue')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: {
          cards: ['Calculator', 'Tools'],
          splay: 'up'
        },
        green: ['Navigation'],
        score: ['Agriculture', 'Canning', 'Sailing', 'Paper'],
        hand: ['Shuriken', 'Rubber'],
      },
    })
  })

  test('dogma (12+)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Calculator'],
        green: ['Navigation', 'Paper', 'Self Service'],
        yellow: ['Agriculture', 'Canning'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Calculator')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Calculator'],
        green: ['Navigation', 'Paper'],
        yellow: ['Agriculture'],
        score: ['Canning', 'Self Service'],
      },
    })
  })
})
