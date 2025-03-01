Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Murasaki Shikibu', () => {

  test('inspire', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Murasaki Shikibu'],
      },
      decks: {
        base: {
          3: ['Machinery', 'Engineering']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.purple')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Murasaki Shikibu'],
        hand: ['Machinery', 'Engineering'],
      },
    })
  })

  test('karma: decree', () => {
    t.testDecreeForTwo('Murasaki Shikibu', 'Rivalry')
  })

  test('karma: achieve (no target in score pile)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Murasaki Shikibu'],
        score: ['Coal']
      },
      achievements: ['The Wheel']
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Achieve.age 1')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Murasaki Shikibu'],
        score: ['Coal'],
        achievements: ['The Wheel']
      },
    })
  })

  test('karma: achieve (valid target in score pile)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Murasaki Shikibu'],
        score: ['Coal', 'Domestication']
      },
      achievements: ['The Wheel']
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Achieve.age 1')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Murasaki Shikibu'],
        score: ['Coal'],
        achievements: ['Domestication']
      },
    })
  })

  test('karma: achieve (can get both)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Murasaki Shikibu'],
        score: ['Software', 'Domestication']
      },
      achievements: ['The Wheel']
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Achieve.age 1')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Murasaki Shikibu'],
        score: ['Software'],
        achievements: ['Domestication', 'The Wheel']
      },
    })
  })

  test('karma: achieve (non-standard)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Murasaki Shikibu'],
        score: ['Software', 'Domestication'],
        hand: ['Homer', 'Fu Xi'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Decree.Rivalry')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Murasaki Shikibu'],
        score: ['Software', 'Domestication'],
        achievements: ['Rivalry']
      },
    })
  })
})
