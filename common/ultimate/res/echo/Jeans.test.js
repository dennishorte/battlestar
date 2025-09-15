Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Jeans", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Jeans'],
        blue: ['Atomic Theory'],
      },
      decks: {
        echo: {
          6: ['Loom', 'Stethoscope'],
          8: ['Crossword', 'Tractor'],
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Jeans')
    request = t.choose(game, request, 'Tractor')
    request = t.choose(game, request, 'Loom')
    request = t.choose(game, request, 8)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Loom'],
        green: ['Jeans'],
        blue: ['Atomic Theory'],
        forecast: ['Crossword']
      },
    })
  })

  test('dogma: was foreseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Atomic Theory'],
        hand: ['Flight'],
        forecast: ['Jeans'],
      },
      junk: ['Morphine'],
      decks: {
        echo: {
          6: ['Loom', 'Stethoscope'],
          8: ['Crossword', 'Tractor'],
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Flight')
    request = t.choose(game, request, 'Tractor')
    request = t.choose(game, request, 'Loom')
    request = t.choose(game, request, 8)
    request = t.choose(game, request, '**echo-6*')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Loom', 'Flight'],
        green: ['Jeans'],
        blue: ['Atomic Theory'],
        hand: ['Morphine'],
        forecast: ['Crossword']
      },
    })
  })
})
