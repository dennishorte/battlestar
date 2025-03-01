Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Ice Skates", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Ice Skates'],
        hand: ['Tools', 'Sailing', 'The Wheel', 'Mathematics'],
      },
      decks: {
        echo: {
          2: ['Horseshoes', 'Toothbrush'],
          3: ['Deodorant'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Ice Skates')
    request = t.choose(game, request, 'Tools', 'Sailing', 'The Wheel')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'draw and meld a {2}')
    request = t.choose(game, request, 'draw and meld a {2}')
    request = t.choose(game, request, 'draw and foreshadow a {3}')
    request = t.choose(game, request, 'Horseshoes')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Ice Skates'],
        yellow: ['Toothbrush'],
        hand: ['Mathematics'],
        forecast: ['Deodorant'],
      },
    })
  })
})
