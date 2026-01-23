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
    request = t.choose(game, 'Dogma.Jeans')
    request = t.choose(game, 'Tractor')
    request = t.choose(game, 'Loom')
    request = t.choose(game, 8)

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
    request = t.choose(game, 'Meld.Flight')
    request = t.choose(game, 'Tractor')
    request = t.choose(game, 'Loom')
    request = t.choose(game, 8)
    request = t.choose(game, '**echo-6*')

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
