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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Hot Air Balloon')
    request = t.choose(game, request, 'Agriculture')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Hot Air Balloon')
    request = t.choose(game, request)

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Hot Air Balloon')

    t.testIsSecondPlayer(game)
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

  test('dogma: no top green card to transfer', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Hot Air Balloon'],
        purple: ['Philosophy'],
        achievements: ['Construction'],
      },
      micah: {
        blue: ['Mathematics'],
        purple: ['Astronomy'],
        score: ['Databases'],
      },
      decks: {
        base: {
          7: ['Lighting', 'Railroad', 'Sanitation', 'Combustion'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Hot Air Balloon')
    request = t.choose(game, request, 'Philosophy')

    t.dumpLog(game)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Hot Air Balloon'],
        yellow: ['Sanitation'],
        hand: ['Combustion'],  // share bonus
        score: ['Railroad'],
        achievements: ['Construction'],
      },
      micah: {
        blue: ['Mathematics'],
        purple: ['Astronomy'],
        score: ['Lighting', 'Databases'],
        achievements: ['Philosophy'],
      },
    })
  })
})
