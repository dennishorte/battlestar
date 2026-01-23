Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Dragon's Lair", () => {

  test('dogma: meld both', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Dragon's Lair"],
      },
      micah: {
        green: ['Navigation'],
        hand: ['Experimentation', 'Coal'],
        score: ['Sailing', 'Mathematics', 'Oars']
      },
      decks: {
        base: {
          3: ['Machinery'],
          10: ['Software'],
        },
        arti: {
          1: ['Holmegaard Bows'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        museum: ['Museum 1', "Dragon's Lair"],
      },
      micah: {
        green: ['Navigation'],
        blue: ['Experimentation', 'Mathematics'],
        hand: ['Coal'],
        score: ['Sailing', 'Oars']
      },
    })

    expect(game.cards.byId('Machinery').zone.id).toBe('junk')
    expect(game.cards.byId('Software').zone.id).toBe('junk')
    expect(game.cards.byId('Holmegaard Bows').zone.id).toBe('junk')
  })

  test('dogma: meld from score only', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Dragon's Lair"],
      },
      micah: {
        green: ['Navigation'],
        score: ['Sailing', 'Mathematics', 'Oars']
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testGameOver(request, 'dennis', "Dragon's Lair")
  })

  test('dogma: meld nothing', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Dragon's Lair"],
      },
      micah: {
        green: ['Navigation'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        museum: ['Museum 1', "Dragon's Lair"],
      },
      micah: {
        green: ['Navigation'],
      },
      junk: [],
    })
  })
})
