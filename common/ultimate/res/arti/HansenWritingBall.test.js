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
          7: ['Explosives', 'Evolution', 'Bicycle', 'Sanitation', 'Lighting', 'Refrigeration', 'Railroad', 'Combustion'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testChoices(request, ['Evolution', 'Experimentation'])

    request = t.choose(game, 'Evolution')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        yellow: ['Refrigeration'],
        hand: ['Explosives', 'Experimentation', 'Bicycle', 'Sanitation', 'Railroad', 'Combustion'],
        museum: ['Museum 1', 'Hansen Writing Ball'],
      },
      micah: {
        green: ['Databases'],
        blue: ['Evolution'],
        hand: ['Lighting'],
      },
    })
  })
})
