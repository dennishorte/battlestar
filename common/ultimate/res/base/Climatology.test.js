Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Climatology', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Climatology'],
        score: ['Astrogeology', 'Software'],
      },
      micah: {
        green: ['The Wheel'],
        blue: ['Writing', 'Experimentation'],
        red: ['Archery'],
        purple: ['Astronomy'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Climatology')
    const request3 = t.choose(game, request2, 'lightbulb')
    const request4 = t.choose(game, request3, 'Writing', 'Astronomy')


    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        score: ['Software'],
      },
      micah: {
        green: ['The Wheel'],
        blue: ['Experimentation'],
        red: ['Archery'],
      },
    })
  })

})
