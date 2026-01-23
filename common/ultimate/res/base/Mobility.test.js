Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Mobility', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Mobility'],
        yellow: ['Canning'],
        green: ['Electricity'],
      },
      micah: {
        red: ['Robotics'],
        purple: ['Specialization', 'Railroad'],
        green: ['Navigation'],
        yellow: ['Stem Cells'],
      },
      decks: {
        base: {
          8: ['Skyscrapers'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Mobility')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Mobility'],
        yellow: ['Canning'],
        green: ['Electricity'],
        score: ['Navigation', 'Stem Cells'],
      },
      micah: {
        red: ['Robotics'],
        purple: ['Specialization', 'Railroad'],
        hand: ['Skyscrapers'],
      },
    })
  })

  test('dogma: two of same value', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Mobility'],
        yellow: ['Canning'],
        green: ['Electricity'],
      },
      micah: {
        red: ['Robotics'],
        purple: ['Specialization', 'Railroad'],
        green: ['Databases'],
        yellow: ['Stem Cells'],
      },
      decks: {
        base: {
          8: ['Skyscrapers'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Mobility')
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Mobility'],
        yellow: ['Canning'],
        green: ['Electricity'],
        score: ['Databases', 'Stem Cells'],
      },
      micah: {
        red: ['Robotics'],
        purple: ['Specialization', 'Railroad'],
        hand: ['Skyscrapers'],
      },
    })
  })
})
