Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Molasses Reef Caravel", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Molasses Reef Caravel"],
        hand: ['Paper'],
      },
      decks: {
        base: {
          4: ['Gunpowder', 'Reformation', 'Navigation'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        green: ['Navigation'],
        hand: ['Gunpowder', 'Reformation'],
        museum: ['Museum 1', 'Molasses Reef Caravel'],
      },
    })

    const junk = game.cards.byZone('junk')
    expect(junk[0].getAge()).toBe(4)
  })
})
