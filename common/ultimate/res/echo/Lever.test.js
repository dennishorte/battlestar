Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Lever", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Lever'],
        hand: ['Tools', 'Sailing', 'Domestication', 'Machinery', 'Novel'],
      },
      decks: {
        echo: {
          2: ['Scissors', 'Pagoda', 'Chaturanga'],
          4: ['Pencil'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Lever')
    request = t.choose(game, 'Tools', 'Sailing', 'Domestication', 'Machinery', 'Novel', 'Scissors')
    request = t.choose(game, 'auto')
    request = t.choose(game, 2)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Lever'],
        hand: ['Pagoda', 'Chaturanga', 'Pencil'],
      },
    })
  })
})
