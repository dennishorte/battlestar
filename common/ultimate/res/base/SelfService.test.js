Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Self Service', () => {

  test('dogma (plus, you do not win)', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game,  {
      dennis: {
        green: ['Self Service'],
        blue: ['Computers', 'Tools'],
        yellow: ['Domestication'],
        hand: ['Canning'],
        achievements: ['Sailing', 'Agriculture', 'Machinery'],
      },
      micah: {
        achievements: ['Software', 'Robotics'],
      },
      decks: {
        base: {
          1: ['The Wheel']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Self Service')

    t.testChoices(request2, ['Computers', 'Domestication'])

    const request3 = t.choose(game, request2, 'Domestication')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Self Service'],
        blue: ['Computers', 'Tools'],
        yellow: ['Canning', 'Domestication'],
        hand: ['The Wheel'],
        achievements: ['Sailing', 'Agriculture', 'Machinery'],
      },
      micah: {
        achievements: ['Software', 'Robotics'],
      }
    })
  })

  test('dogma (you win 1)', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game,  {
      dennis: {
        green: ['Self Service'],
        blue: ['Computers', 'Tools'],
        yellow: ['Domestication'],
        hand: ['Canning'],
        achievements: ['Sailing'],
      },
      decks: {
        base: {
          1: ['The Wheel']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Self Service')

    t.testGameOver(request2, 'dennis', 'Self Service')
  })

  test('dogma (you win 2)', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game,  {
      dennis: {
        green: ['Self Service'],
        blue: ['Computers', 'Tools'],
        yellow: ['Domestication'],
        hand: ['Canning'],
        achievements: ['Sailing', 'Domestication'],
      },
      micah: {
        achievements: ['Software'],
      },
      decks: {
        base: {
          1: ['The Wheel']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Self Service')

    t.testGameOver(request2, 'dennis', 'Self Service')
  })
})
