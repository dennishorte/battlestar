Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Bandage", () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Bandage'],
        hand: ['The Wheel', 'Pottery'],
      },
      micah: {
        yellow: ['Agriculture'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Bandage')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Bandage'],
        blue: ['Pottery'],
        hand: ['The Wheel'],
      },
      micah: {
        yellow: ['Agriculture'],
      },
    })
  })

  test('dogma: only return one', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Bandage'],
        yellow: ['Agriculture'],
      },
      micah: {
        purple: ['Lighting'],
        hand: ['Enterprise'],
        score: ['Calendar', 'Gunpowder', 'Software'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Bandage')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Bandage'],
        yellow: ['Agriculture'],
      },
      micah: {
        purple: ['Lighting'],
        hand: ['Enterprise'],
        score: ['Calendar', 'Gunpowder'],
      },
    })
  })

  test('dogma: return both', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Bandage'],
        yellow: ['Agriculture'],
      },
      micah: {
        purple: ['Lighting'],
        hand: ['Enterprise', 'Databases'],
        score: ['Calendar', 'Gunpowder', 'Software'],
        achievements: ['Empire', 'World'],
      },
      achievements: ['Mathematics'],
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Bandage')
    request = t.choose(game, '**base-2*', 'Monument')
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Bandage'],
        yellow: ['Agriculture'],
      },
      micah: {
        purple: ['Lighting'],
        hand: ['Enterprise'],
        score: ['Calendar', 'Gunpowder'],
        achievements: ['Empire', 'World'],
      },
      junk: ['Monument', 'Mathematics'],
    })
  })
})
