Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe("Chintz", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Perspective'],
        green: ['Chintz'],
      },
      decks: {
        base: {
          4: ['Experimentation', 'Enterprise', 'Gunpowder'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Chintz')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Perspective'],
        green: ['Chintz'],
        hand: ['Enterprise', 'Experimentation'],
        score: ['Gunpowder'],
      },
    })
  })

  test('dogma: more than one in hand', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Chintz'],
        hand: ['Tools'],
      },
      decks: {
        echo: {
          4: ['Clock'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Chintz')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Chintz'],
        hand: ['Tools', 'Clock'],
      },
    })
  })

  test('dogma: was foreseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        forecast: ['Chintz'],
        hand: ['Tools', 'Perspective'],
      },
      achievements: [],
      decks: {
        base: {
          4: ['Gunpowder'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Perspective')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Perspective'],
        green: ['Chintz'],
      },
      standardAchievements: ['Tools', 'Gunpowder'],
    })
  })
})
