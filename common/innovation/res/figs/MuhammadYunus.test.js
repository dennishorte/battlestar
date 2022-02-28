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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.green')

    t.testIsSecondPlayer(request2)
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Code of Laws')
    const request3 = t.choose(game, request2)

    t.testChoices(request3, ['Invention']) // Micah's choice for Code of Laws
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Code of Laws')
    const request3 = t.choose(game, request2, 'Canning')

    t.testChoices(request3, ['The Wheel']) // Dennis's choice for Code of Laws
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Code of Laws')
    const request3 = t.choose(game, request2)

    t.testChoices(request3, ['Invention']) // Dennis's choice for Code of Laws
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Code of Laws')
    const request3 = t.choose(game, request2, 'Canning')

    t.testChoices(request3, ['The Wheel']) // Micah's choice for Code of Laws
  })
})
