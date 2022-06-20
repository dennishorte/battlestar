Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Hot Air Balloon", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Hot Air Balloon'],
        purple: ['Philosophy'],
        score: ['Canning'],
      },
      micah: {
        yellow: ['Agriculture'],
        blue: ['Mathematics'],
        green: ['Compass'],
        achievements: ['The Wheel', 'Engineering']
      },
      decks: {
        base: {
          7: ['Lighting'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Hot Air Balloon')
    const request3 = t.choose(game, request2, 'Agriculture')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        purple: ['Philosophy'],
        score: ['Canning', 'Lighting'],
        achievements: ['Agriculture'],
      },
      micah: {
        blue: ['Mathematics'],
        green: ['Hot Air Balloon', 'Compass'],
        achievements: ['The Wheel', 'Engineering']
      },
    })
  })

  test('dogma: do not transfer', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Hot Air Balloon'],
        purple: ['Philosophy'],
        score: ['Canning'],
      },
      micah: {
        yellow: ['Agriculture'],
        blue: ['Mathematics'],
        green: ['Compass'],
        achievements: ['The Wheel', 'Engineering']
      },
      decks: {
        base: {
          7: ['Lighting', 'Railroad'],
        },
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Hot Air Balloon')
    const request3 = t.choose(game, request2)

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        green: ['Hot Air Balloon'],
        purple: ['Railroad', 'Philosophy'],
        score: ['Canning', 'Lighting'],
      },
      micah: {
        yellow: ['Agriculture'],
        blue: ['Mathematics'],
        green: ['Compass'],
        achievements: ['The Wheel', 'Engineering']
      },
    })
  })

  test('dogma: not eligible', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Hot Air Balloon'],
        purple: ['Philosophy'],
      },
      micah: {
        blue: ['Mathematics'],
        green: ['Compass'],
        achievements: ['The Wheel', 'Engineering']
      },
      decks: {
        base: {
          7: ['Lighting', 'Railroad'],
        },
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Hot Air Balloon')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        green: ['Hot Air Balloon'],
        purple: ['Railroad', 'Philosophy'],
        score: ['Lighting'],
      },
      micah: {
        blue: ['Mathematics'],
        green: ['Compass'],
        achievements: ['The Wheel', 'Engineering']
      },
    })
  })
})
