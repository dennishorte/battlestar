Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Medicine', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Medicine'],
        score: ['The Wheel', 'Construction'],
      },
      micah: {
        score: ['Enterprise', 'Fermenting', 'Reformation'],
      },
      achievements: ['Machinery'], // Age 3 achievement
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Medicine')
    request = t.choose(game, 'Reformation') // Highest from micah's score
    // The Wheel (lowest from dennis's score) is auto-selected when there's only one
    // Machinery (only age 3 achievement) is auto-selected when there's only one

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Medicine'],
        score: ['Reformation', 'Construction'],
      },
      micah: {
        score: ['Enterprise', 'Fermenting', 'The Wheel'],
      },
      junk: ['Machinery'], // Achievement was junked
    })
  })

  test('dogma (no target)', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Medicine'],
      },
      micah: {
        score: ['Enterprise', 'Fermenting', 'Reformation'],
      },
      achievements: ['Machinery'], // Age 3 achievement (only one to avoid pattern ambiguity)
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Medicine')
    request = t.choose(game, 'Reformation') // Highest from micah's score
    // No lowest card from dennis's score (dennis has no score cards)
    // Machinery (only age 3 achievement) is auto-selected when there's only one

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Medicine'],
        score: ['Reformation'],
      },
      micah: {
        score: ['Enterprise', 'Fermenting'],
      },
      junk: ['Machinery'], // Achievement was junked
    })
  })
})
