Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Charles Darwin', () => {

  test('karma: decree', () => {
    t.testDecreeForTwo('Charles Darwin', 'Advancement')
  })

  test('karma: win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Charles Darwin'],
        score: ['Machine Tools'],
        achievements: ['Empire'],
      },
      achievements: ['The Wheel']
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Achieve.*base-1*')

    t.testGameOver(request, 'dennis', 'Charles Darwin')
  })

  test('karma: win ties also', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Charles Darwin'],
        score: ['Machine Tools'],
      },
      achievements: ['The Wheel'],
      decks: {
        figs: {
          1: ['Fu Xi']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Achieve.*base-1*')

    t.testGameOver(request, 'dennis', 'Charles Darwin')
  })

  test('karma: otherwise, draw an 8', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Charles Darwin'],
        score: ['Machine Tools'], // Enough score to claim age 1 achievement
      },
      micah: {
        achievements: ['The Wheel'], // micah has 1 achievement, dennis has 0
      },
      achievements: ['Sailing'], // Age 1 achievement for dennis to claim
      decks: {
        base: {
          8: ['Skyscrapers'], // Age 8 card to be drawn
        },
        figs: {
          1: ['Sargon of Akkad'],
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Achieve.*base-1*') // dennis tries to claim Sailing
    // Karma triggers: micah has 1 achievement, dennis has 0
    // Since micah has more, dennis draws an age 8 card instead of winning
    // Then the achievement claim proceeds normally

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Charles Darwin'],
        score: ['Machine Tools'],
        hand: ['Skyscrapers'], // Drew age 8 card from karma
        achievements: ['Sailing'], // Achievement was still claimed
      },
      micah: {
        achievements: ['The Wheel'],
        hand: ['Sargon of Akkad'], // Drew figure when dennis claimed standard achievement
      },
    })
  })
})
