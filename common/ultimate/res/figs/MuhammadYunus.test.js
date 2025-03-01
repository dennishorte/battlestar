Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Muhammad Yunus', () => {

  test('inspire', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Muhammad Yunus'],
      },
      decks: {
        base: {
          10: ['Robotics', 'Software']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.green')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Muhammad Yunus'],
        hand: ['Robotics', 'Software'],
      },
    })
  })

  test('karma: dogma (active player, no)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Muhammad Yunus'],
        purple: ['Code of Laws'],
        hand: ['The Wheel', 'Canning']
      },
      micah: {
        green: ['Navigation'],
        purple: ['Enterprise'],
        hand: ['Domestication', 'Invention']
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Code of Laws')
    request = t.choose(game, request)

    t.testChoices(request, ['Invention']) // Micah's choice for Code of Laws
  })

  test('karma: dogma (active player, yes)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Muhammad Yunus'],
        purple: ['Code of Laws'],
        hand: ['The Wheel', 'Canning']
      },
      micah: {
        green: ['Navigation'],
        purple: ['Enterprise'],
        hand: ['Domestication', 'Invention']
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Code of Laws')
    request = t.choose(game, request, 'Canning')

    t.testChoices(request, ['The Wheel']) // Dennis's choice for Code of Laws
  })

  test('karma: dogma (non-active player, no)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      micah: {
        green: ['Muhammad Yunus'],
        hand: ['The Wheel', 'Canning']
      },
      dennis: {
        green: ['Navigation'],
        purple: ['Code of Laws'],
        hand: ['Domestication', 'Invention']
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Code of Laws')
    request = t.choose(game, request)

    t.testChoices(request, ['Invention']) // Dennis's choice for Code of Laws
  })

  test('karma: dogma (non-active player, yes)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      micah: {
        green: ['Muhammad Yunus'],
        hand: ['The Wheel', 'Canning']
      },
      dennis: {
        green: ['Navigation'],
        purple: ['Code of Laws'],
        hand: ['Domestication', 'Invention']
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Code of Laws')
    request = t.choose(game, request, 'Canning')

    t.testChoices(request, ['The Wheel']) // Micah's choice for Code of Laws
  })

  test('karma: three players', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        green: ['Navigation'],
        purple: ['Code of Laws'],
        hand: ['Domestication', 'Invention']
      },
      micah: {
        hand: ['Sailing'],
      },
      scott: {
        green: ['Muhammad Yunus'],
        hand: ['The Wheel', 'Canning']
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Code of Laws')
    request = t.choose(game, request, 'Canning')

    t.testChoices(request, ['The Wheel']) // Micah's choice for Code of Laws
  })
})
