Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Masonry', () => {

  test('dogma: claim achievement', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Archery', 'Oars'],
        yellow: ['Masonry'],
        hand: ['Tools', 'The Wheel', 'Fermenting', 'Engineering', 'Sailing'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Masonry')

    t.testChoices(request, ['Tools', 'The Wheel', 'Fermenting', 'Engineering'], 0, 4)

    request = t.choose(game, request, 'Tools', 'The Wheel', 'Fermenting', 'Engineering')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Fermenting', 'Masonry'],
        red: ['Engineering', 'Archery', 'Oars'],
        green: ['The Wheel'],
        blue: ['Tools'],
        hand: ['Sailing'],
        achievements: ['Monument'],
      },
    })
  })

  test('dogma: too few for achievement', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Archery', 'Oars'],
        yellow: ['Masonry'],
        hand: ['Tools', 'The Wheel', 'Fermenting', 'Sailing'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Masonry')

    t.testChoices(request, ['Tools', 'The Wheel', 'Fermenting'], 0, 3)

    request = t.choose(game, request, 'Tools', 'The Wheel', 'Fermenting')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Fermenting', 'Masonry'],
        red: ['Archery', 'Oars'],
        green: ['The Wheel'],
        blue: ['Tools'],
        hand: ['Sailing'],
        achievements: [],
      },
    })
  })

  test('dogma: too many for achievement', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Archery', 'Oars', 'Road Building'],
        yellow: ['Masonry'],
        hand: ['Tools', 'The Wheel', 'Fermenting', 'Sailing', 'Engineering'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Masonry')

    t.testChoices(request, ['Tools', 'The Wheel', 'Fermenting', 'Engineering',], 0, 4)

    request = t.choose(game, request, 'Tools', 'The Wheel', 'Fermenting', 'Engineering')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Fermenting', 'Masonry'],
        red: ['Engineering', 'Archery', 'Oars', 'Road Building'],
        green: ['The Wheel'],
        blue: ['Tools'],
        hand: ['Sailing'],
        achievements: [],
      },
    })
  })

  test('dogma: meld none', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Masonry'],
        hand: ['Tools', 'The Wheel', 'Fermenting', 'Engineering', 'Sailing'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Masonry')
    request = t.choose(game, request)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Masonry'],
        hand: ['Tools', 'The Wheel', 'Fermenting', 'Engineering', 'Sailing'],
      },
    })
  })
})
