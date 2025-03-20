Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Ice Skates", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Ice Skates'],
        hand: ['Tools', 'Sailing', 'Mathematics'],
      },
      decks: {
        echo: {
          2: ['Horseshoes'],
          3: ['Deodorant'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Ice Skates')
    request = t.choose(game, request, 'Tools', 'Sailing')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'draw and meld a {2}')
    request = t.choose(game, request, 'draw and foreshadow a {3}')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Ice Skates'],
        hand: ['Mathematics'],
        forecast: ['Deodorant'],
      },
    })
  })
})
