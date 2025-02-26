Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Linguistics", () => {

  test('dogma: draw a 3', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Linguistics'],
      },
      decks: {
        base: {
          3: ['Machinery'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Linguistics')
    const request3 = t.choose(game, request2, 'Draw a 3')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        blue: ['Linguistics'],
        hand: ['Machinery'],
      },
    })
  })

  test('dogma: foreshadow and bonus', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Linguistics'],
        red: ['Plumbing'],
      },
      decks: {
        base: {
          2: ['Construction'],
          4: ['Gunpowder'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Linguistics')
    const request3 = t.choose(game, request2, 'Draw and foreshadow a 4')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        blue: ['Linguistics'],
        red: ['Plumbing'],
        hand: ['Construction'],
        forecast: ['Gunpowder'],
      },
    })
  })
})
