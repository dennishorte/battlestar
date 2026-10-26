Error.stackTraceLimit = 100

const t = require('../../testutil.js')

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
    request = t.choose(game, 'Dogma.Skyscrapers')
    request = t.choose(game, 'Computers')

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

  test('dogma: yellow cards with a lightbulb are not choices', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Skyscrapers'],
      },
      micah: {
        blue: ['Computers'],
        green: ['Databases'],
        yellow: ['Subway'],
        red: ['Gunpowder'],
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Skyscrapers')

    t.testChoices(request, ['Computers', 'Databases'])
  })
})
