Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Scouting', () => {

  test('dogma, return one', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Scouting'],
      },
      decks: {
        base: {
          9: ['Computers'],
        },
        usee: {
          9: ['Teleprompter'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Scouting')
    request = t.choose(game, request, 'Teleprompter')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Scouting'],
        hand: ['Computers'],
      },
    })
  })

  test('dogma, return two; no match', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Scouting'],
      },
      decks: {
        base: {
          9: ['Computers'],
          10: ['Robotics'],
        },
        usee: {
          9: ['Teleprompter'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Scouting')
    request = t.choose(game, request, 'Teleprompter', 'Computers')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Scouting'],
      },
    })

    expect(game.getZoneByDeck('base', 10).cards()[0].name).toBe('Robotics')
  })

  test('dogma, return two; match', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Scouting'],
      },
      decks: {
        base: {
          9: ['Computers'],
          10: ['Software'],
        },
        usee: {
          9: ['Teleprompter'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Scouting')
    request = t.choose(game, request, 'Teleprompter', 'Computers')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Scouting'],
        hand: ['Software'],
      },
    })
  })

})
