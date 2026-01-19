Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Skyscrapers', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game,  {
      dennis: {
        yellow: ['Skyscrapers'],
      },
      micah: {
        blue: ['Computers', 'Experimentation', 'Tools'],
        green: ['Databases'],
        yellow: ['Canning'],
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Skyscrapers')
    request = t.choose(game, request, 'Computers')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        hand: ['Skyscrapers'],
        blue: ['Computers'],
      },
      micah: {
        green: ['Databases'],
        yellow: ['Canning'],
        score: ['Experimentation'],
      }
    })
  })
})
