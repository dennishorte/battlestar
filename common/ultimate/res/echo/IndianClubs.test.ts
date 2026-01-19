Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe("Indian Clubs", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Indian Clubs'],
        score: ['Masonry', 'Gunpowder'],
        hand: ['Code of Laws', 'Engineering', 'Enterprise', 'Astronomy'],
      },
      micah: {
        score: ['Tools', 'Sailing', 'The Wheel'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Indian Clubs')
    request = t.choose(game, request, 'Tools', 'Sailing')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Indian Clubs'],
        score: ['Masonry', 'Gunpowder', 'Code of Laws', 'Enterprise'],
        hand: ['Engineering', 'Astronomy'],
      },
      micah: {
        score: ['The Wheel'],
      },
    })
  })

  test('dogma: was foreseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        score: ['Masonry', 'Gunpowder'],
        hand: ['Code of Laws', 'Engineering', 'Enterprise', 'Astronomy', 'Lighting'],
        forecast: ['Indian Clubs'],
      },
      micah: {
        score: ['Tools', 'Sailing', 'The Wheel'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Lighting')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Indian Clubs', 'Lighting'],
        score: ['Masonry', 'Gunpowder', 'Code of Laws', 'Enterprise'],
        hand: ['Engineering', 'Astronomy'],
      },
      micah: {
        score: [],
      },
    })
  })
})
