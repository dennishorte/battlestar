Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Philosopher's Stone", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Philosopher's Stone"],
        hand: ['Calendar', 'Mathematics', 'Tools', 'Sailing']
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'Calendar')
    request = t.choose(game, request, 'Tools', 'Sailing')
    request = t.choose(game, request, 'auto')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        score: ['Tools', 'Sailing'],
        hand: ['Mathematics'],
        museum: ['Museum 1', "Philosopher's Stone"],
      },
    })

    const junk = game.cards.byZone('junk')
    expect(junk[0].getAge()).toBe(2)
  })
})
