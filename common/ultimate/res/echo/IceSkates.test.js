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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Ice Skates')
    const request3 = t.choose(game, request2, 'Tools', 'Sailing', 'The Wheel')
    const request4 = t.choose(game, request3, 'auto')
    const request5 = t.choose(game, request4, 'draw and meld a {2}')
    const request6 = t.choose(game, request5, 'draw and meld a {2}')
    const request7 = t.choose(game, request6, 'draw and foreshadow a {3}')
    const request8 = t.choose(game, request7, 'Horseshoes')

    t.testIsSecondPlayer(request8)
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
