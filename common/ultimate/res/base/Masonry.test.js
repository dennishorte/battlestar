Error.stackTraceLimit = 100

const t = require('../../testutil.js')

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Masonry')

    t.testChoices(request2, ['Tools', 'The Wheel', 'Fermenting', 'Engineering'], 0, 4)

    const request3 = t.choose(game, request2, 'Tools', 'The Wheel', 'Fermenting', 'Engineering')
    const request4 = t.choose(game, request3, 'auto')

    t.testIsSecondPlayer(request4)
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Masonry')

    t.testChoices(request2, ['Tools', 'The Wheel', 'Fermenting'], 0, 3)

    const request3 = t.choose(game, request2, 'Tools', 'The Wheel', 'Fermenting')
    const request4 = t.choose(game, request3, 'auto')

    t.testIsSecondPlayer(request4)
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Masonry')

    t.testChoices(request2, ['Tools', 'The Wheel', 'Fermenting', 'Engineering',], 0, 4)

    const request3 = t.choose(game, request2, 'Tools', 'The Wheel', 'Fermenting', 'Engineering')
    const request4 = t.choose(game, request3, 'auto')

    t.testIsSecondPlayer(request4)
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Masonry')
    const request3 = t.choose(game, request2)

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        yellow: ['Masonry'],
        hand: ['Tools', 'The Wheel', 'Fermenting', 'Engineering', 'Sailing'],
      },
    })
  })
})
