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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testChoices(request2, ['Atomic Theory', 'Experimentation'])

    const request3 = t.choose(game, request2, 'Atomic Theory')

    t.testIsFirstAction(request3)
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
