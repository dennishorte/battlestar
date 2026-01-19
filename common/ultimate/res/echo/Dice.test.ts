Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe("Dice", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['The Wheel'],
        blue: ['Dice'],
        hand: ['Tools'],
      },
      decks: {
        base: {
          2: ['Fermenting'],
        },
        echo: {
          1: ['Plumbing'],
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Dice')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['The Wheel'],
        blue: ['Dice'],
        yellow: ['Fermenting'],
        hand: ['Tools', 'Plumbing'],
      },
    })
  })

  test('dogma: no bonus', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Dice'],
        hand: ['Tools'],
      },
      decks: {
        echo: {
          1: ['Ruler'],
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Dice')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Dice'],
        hand: ['Tools', 'Ruler'],
      },
    })
  })

  test('dogma: was foreseen; noone with more bonus points', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['The Wheel'],
        hand: ['Tools'],
        forecast: ['Dice'],
      },
      decks: {
        base: {
          2: ['Fermenting'],
        },
        echo: {
          1: ['Plumbing'],
          4: ['Pencil'],
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Tools')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['The Wheel'],
        blue: ['Dice', 'Tools'],
        yellow: ['Fermenting'],
        hand: ['Plumbing', 'Pencil'],
      },
    })
  })

  test('dogma: was foreseen; must pass it', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['The Wheel'],
        hand: ['Tools'],
        forecast: ['Dice'],
      },
      micah: {
        purple: ['Puppet'],
      },
      decks: {
        base: {
          2: ['Fermenting'],
        },
        echo: {
          1: ['Plumbing'],
          4: ['Pencil'],
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Tools')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['The Wheel'],
        blue: ['Dice', 'Tools'],
        yellow: ['Fermenting'],
        hand: ['Plumbing'],
      },
      micah: {
        purple: ['Puppet'],
        hand: ['Pencil'],
      },
    })
  })
})
