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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Shivaji')
    const request3 = t.choose(game, request2, 'Navigation')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Shivaji'],
      },
    })
    expect(game.getCardByName('Navigation').zone).toBe('achievements')
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Achieve.age 1')

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
