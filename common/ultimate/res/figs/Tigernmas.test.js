Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Tigernmas', () => {
  test('karma: decree', () => {
    t.testDecreeForTwo('Tigernmas', 'War')
  })

  test('karma: score', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Tigernmas'],
        hand: ['Tools', 'Robotics'],
      },
    })

    let request
    request = game.run()

    expect(t.dennis(game).score()).toBe(2)
  })
})
