Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe("Linguistics", () => {

  test('dogma: draw a 3', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Fermenting'],
        blue: ['Linguistics'],
      },
      decks: {
        base: {
          3: ['Machinery'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Linguistics')
    request = t.choose(game, request, 'Draw a 3')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Fermenting'],
        blue: ['Linguistics'],
        hand: ['Machinery'],
      },
    })
  })

  test('dogma: foreshadow and bonus', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Fermenting'],
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Linguistics')
    request = t.choose(game, request, 'Draw and foreshadow a 4')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Fermenting'],
        blue: ['Linguistics'],
        red: ['Plumbing'],
        hand: ['Construction'],
        forecast: ['Gunpowder'],
      },
    })
  })

  test('dogma: was foreseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Plumbing'],
        hand: ['Fermenting'],
        forecast: ['Linguistics'],
      },
      decks: {
        base: {
          2: ['Construction'],
          4: ['Gunpowder'],
        },
      },
      achievements: ['Philosophy', 'Optics'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Fermenting')
    request = t.choose(game, request, 'Draw and foreshadow a 4')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Fermenting'],
        blue: ['Linguistics'],
        red: ['Plumbing'],
        hand: ['Construction'],
        forecast: ['Gunpowder'],
      },
      junk: ['Philosophy'],
    })
  })
})
