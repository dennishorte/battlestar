Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Bangle', () => {

  test('dogma: draw and forecast', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game, {
      dennis: {
        red: ['Bangle'],
        green: ['Sailing'],
        forecast: ['Tools', 'Construction'],
      },
      decks: {
        base: {
          2: ['Fermenting'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Bangle')
    request = t.choose(game, request, 'Draw and foreshadow')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Bangle'],
        green: ['Sailing'],
        forecast: ['Tools', 'Construction', 'Fermenting'],
      },
    })
  })

  test('dogma: tuck from forecast', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game, {
      dennis: {
        red: ['Bangle'],
        green: ['Sailing'],
        forecast: ['Tools', 'Construction'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Bangle')
    request = t.choose(game, request, 'Tuck from forecast')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Bangle', 'Construction'],
        green: ['Sailing'],
        forecast: ['Tools'],
      },
    })
  })

  test('dogma: no cards in forecast', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game, {
      dennis: {
        red: ['Bangle'],
        green: ['Sailing'],
        forecast: ['Construction'],
      },
      decks: {
        base: {
          3: ['Machinery'],
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Bangle')
    request = t.choose(game, request, 'Tuck from forecast')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Bangle', 'Construction'],
        green: ['Sailing'],
        forecast: ['Machinery'],
      },
    })
  })

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game, {
      dennis: {
        red: ['Bangle'],
        green: ['Sailing'],
        hand: ['The Wheel', 'Construction'],
      },
      decks: {
        base: {
          2: ['Fermenting'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Bangle')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Bangle'],
        green: ['Sailing', 'The Wheel'],
        hand: ['Construction'],
        forecast: ['Fermenting'],
      },
    })
  })
})
