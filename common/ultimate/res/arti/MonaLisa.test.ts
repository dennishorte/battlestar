Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe("Mona Lisa", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Mona Lisa"],
        red: ['Construction', 'Archery'],
        hand: ['Oars']
      },
      decks: {
        base: {
          4: ['Gunpowder', 'Reformation', 'Experimentation', 'Enterprise', 'Perspective'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 2)
    request = t.choose(game, request, 'red')
    request = t.choose(game, request, 'auto')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Construction', 'Archery'],
          splay: 'right'
        },
        hand: ['Reformation', 'Experimentation', 'Enterprise', 'Perspective'],
        score: ['Oars', 'Gunpowder'],
        museum: ['Museum 1', 'Mona Lisa'],
      },
    })
  })

  test('dogma: guess wrong', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Mona Lisa"],
        red: ['Construction', 'Archery'],
        hand: ['Oars']
      },
      decks: {
        base: {
          4: ['Gunpowder', 'Reformation', 'Experimentation', 'Enterprise', 'Perspective'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 1)
    request = t.choose(game, request, 'red')
    request = t.choose(game, request, 'auto')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: ['Construction', 'Archery'],
        museum: ['Museum 1', 'Mona Lisa'],
      },
    })
  })
})
