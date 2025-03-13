Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Hansen Writing Ball', () => {

  test('dogma: not on board', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Hansen Writing Ball'],
      },
      micah: {
        green: ['Databases'],
        hand: ['Experimentation'],
      },
      decks: {
        base: {
          7: ['Explosives', 'Atomic Theory', 'Bicycle', 'Sanitation', 'Lighting', 'Refrigeration', 'Railroad', 'Combustion'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testChoices(request, ['Atomic Theory', 'Experimentation'])

    request = t.choose(game, request, 'Atomic Theory')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        yellow: ['Refrigeration'],
        hand: ['Explosives', 'Experimentation', 'Bicycle', 'Sanitation', 'Railroad', 'Combustion'],
      },
      micah: {
        green: ['Databases'],
        blue: ['Atomic Theory'],
        hand: ['Lighting'],
      },
    })
  })
})
