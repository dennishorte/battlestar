Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Shivaji', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Shivaji'],
        green: ['Navigation'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Shivaji')
    request = t.choose(game, request, 'Navigation')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Shivaji'],
      },
    })
    expect(game.cards.byId('Navigation').zone).toBe('achievements')
  })

  test('karma: decree', () => {
    t.testDecreeForTwo('Shivaji', 'War')
  })

  test('karma: achieve', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Domestication'],
        score: ['Coal'],
      },
      micah: {
        red: ['Shivaji'],
        score: ['Canning'],
      },
      achievements: ['The Wheel'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Achieve.age 1')

    t.setBoard(game, {
      dennis: {
        score: ['Coal'],
      },
      micah: {
        red: ['Shivaji'],
        score: ['Canning'],
        achievements: ['The Wheel'],
      },
    })
  })
})
