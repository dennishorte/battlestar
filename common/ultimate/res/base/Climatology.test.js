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

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Climatology')
    request = t.choose(game, 'lightbulb')
    request = t.choose(game, 'Writing', 'Astronomy')


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
