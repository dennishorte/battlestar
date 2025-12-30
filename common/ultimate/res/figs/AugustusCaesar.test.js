Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Augustus Caesar', () => {
  test('karma: owner dogmas card with {k}, drawn card has {k}, meld it', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Augustus Caesar'],
        red: ['Archery'], // Has {k} biscuit
        hand: [],
      },
      micah: {
        hand: ['Gunpowder', 'Currency'], // Cards that would be transferred if Archery dogma executed
      },
      achievements: ['The Wheel', 'Mathematics'], // Achievements that could be junked
      decks: {
        base: {
          1: ['Metalworking'], // Has {k} biscuit, age 1 - will be drawn and melded
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Archery')

    t.testBoard(game, {
      dennis: {
        green: ['Augustus Caesar'],
        red: ['Metalworking', 'Archery'], // Metalworking was melded (meld puts cards at front)
        hand: [],
      },
      micah: {
        hand: ['Gunpowder', 'Currency'], // No transfer occurred (Archery dogma did not execute)
      },
      junk: [], // No achievement was junked (Archery dogma did not execute)
    })
  })

  test('karma: owner dogmas card with {k}, drawn card has {s}, meld it', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Augustus Caesar'],
        red: ['Archery'], // Has {k} biscuit, age 1
        hand: [],
      },
      micah: {
        hand: ['Gunpowder', 'Currency'],
      },
      achievements: ['The Wheel', 'Mathematics'],
      decks: {
        base: {
          1: ['Tools'], // Has {s} biscuit, age 1
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Archery')

    t.testBoard(game, {
      dennis: {
        green: ['Augustus Caesar'],
        blue: ['Tools'], // Tools was melded to its own color (blue)
        red: ['Archery'],
        hand: [],
      },
      micah: {
        hand: ['Gunpowder', 'Currency'], // No transfer occurred
      },
      junk: [], // No achievement was junked
    })
  })

  test('karma: owner dogmas card with {k}, drawn card has neither {k} nor {s}, super-execute original', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Augustus Caesar'],
        red: ['Archery'], // Has {k} biscuit, age 1
        hand: [],
      },
      micah: {
        hand: ['Gunpowder', 'Currency'], // Age 4 and Age 3
      },
      achievements: ['The Wheel', 'Mathematics'],
      decks: {
        base: {
          1: ['Code of Laws', 'Tools'], // Code of Laws drawn by karma, Tools drawn by demand
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Archery')
    request = t.choose(game, request, '**base-1*') // Choose achievement to junk

    t.testBoard(game, {
      dennis: {
        green: ['Augustus Caesar'],
        red: ['Archery'],
        hand: ['Code of Laws', 'Gunpowder'], // Code of Laws from karma draw, Gunpowder transferred from micah
      },
      micah: {
        hand: ['Currency', 'Tools'], // Currency remains, Tools drawn by demand effect
      },
      junk: ['The Wheel'], // Achievement was junked (super-execute ran both effects)
    })
  })

  test('karma: opponent dogmas card with {k}, drawn card has {k}, meld it', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Archery'], // Has {k} biscuit - dennis does the karma action
        hand: [],
      },
      micah: {
        green: ['Augustus Caesar'], // Owner of karma card
      },
      decks: {
        base: {
          1: ['Metalworking'], // Has {k} biscuit, age 1 - drawn to micah (owner of Augustus Caesar), then melded
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Archery')

    t.testBoard(game, {
      dennis: {
        red: ['Archery'],
        hand: [], // No transfer occurred (Archery dogma did not execute)
      },
      micah: {
        green: ['Augustus Caesar'],
        red: ['Metalworking'], // Metalworking was melded to micah (owner of karma card)
      },
      junk: [], // No achievement was junked (Archery dogma did not execute)
    })
  })

  test('karma: opponent dogmas card with {k}, drawn card has {s}, meld it', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Archery'], // Has {k} biscuit, age 1 - dennis does the karma action
        hand: [],
      },
      micah: {
        green: ['Augustus Caesar'], // Owner of karma card
      },
      decks: {
        base: {
          1: ['Tools'], // Has {s} biscuit, age 1 - drawn to micah (owner of Augustus Caesar), then melded
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Archery')

    t.testBoard(game, {
      dennis: {
        red: ['Archery'],
        hand: [], // No transfer occurred (Archery dogma did not execute)
      },
      micah: {
        green: ['Augustus Caesar'],
        blue: ['Tools'], // Tools was melded to micah (owner of karma card)
      },
      junk: [], // No achievement was junked (Archery dogma did not execute)
    })
  })

  test('karma: opponent dogmas card with {k}, drawn card has neither {k} nor {s}, super-execute original', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Archery'], // Has {k} biscuit, age 1 - dennis does the karma action
        hand: [],
      },
      micah: {
        green: ['Augustus Caesar'], // Owner of karma card
        hand: ['Gunpowder'],
      },
      achievements: ['The Wheel', 'Mathematics'],
      decks: {
        base: {
          1: ['Code of Laws', 'Tools'], // Code of Laws drawn by karma to micah, Tools drawn by demand to micah
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Archery')
    request = t.choose(game, request, '**base-1*') // Choose achievement to junk

    t.testBoard(game, {
      dennis: {
        red: ['Archery'],
        hand: ['Gunpowder'], // Gunpowder transferred from micah by demand
      },
      micah: {
        green: ['Augustus Caesar'],
        hand: ['Code of Laws', 'Tools'], // Code of Laws from karma draw, Tools drawn by demand effect
      },
      junk: ['The Wheel'], // Achievement was junked (super-execute ran both effects)
    })
  })

  test('karma: does not trigger when dogmatizing card without {k}', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Augustus Caesar'],
        purple: ['Code of Laws'], // No {k} biscuit
        blue: ['Tools'],
        hand: ['Writing'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Code of Laws')
    request = t.choose(game, request, 'Writing')
    request = t.choose(game, request, 'blue')

    t.testBoard(game, {
      dennis: {
        green: ['Augustus Caesar'],
        purple: ['Code of Laws'],
        blue: {
          cards: ['Tools', 'Writing'],
          splay: 'left',
        },
        hand: [],
      },
      junk: [], // No card was drawn and revealed (karma did not trigger)
    })
  })

  test('karma: triggers for age 2 card with {k}', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Augustus Caesar'],
        red: ['Road Building'], // Has {k} biscuit, age 2
        hand: [],
      },
      micah: {
        green: ['The Wheel'],
        hand: ['Construction'],
      },
      decks: {
        base: {
          2: ['Philosophy'], // Has {s} biscuit, age 2 - will be drawn
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Road Building')

    t.testBoard(game, {
      dennis: {
        green: ['Augustus Caesar'],
        purple: ['Philosophy'], // Philosophy was melded to its own color (purple)
        red: ['Road Building'],
        hand: [],
      },
      micah: {
        green: ['The Wheel'],
        hand: ['Construction'], // No transfer occurred (Road Building dogma did not execute)
      },
      junk: [], // No cards were melded from hand (Road Building dogma did not execute)
    })
  })
})
