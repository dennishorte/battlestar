Error.stackTraceLimit = 100

import t from '../../testutil.js'

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Self Service')

    t.testChoices(request, ['Computers', 'Domestication'])

    request = t.choose(game, request, 'Domestication')

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Self Service')

    t.testGameOver(request, 'dennis', 'Self Service')
  })

  test('dogma (you win 2)', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game,  {
      dennis: {
        green: ['Self Service'],
        blue: ['Computers', 'Tools'],
        yellow: ['Agriculture'],
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Self Service')

    t.testGameOver(request, 'dennis', 'Self Service')
  })
})
