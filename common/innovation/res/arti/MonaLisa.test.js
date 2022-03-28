Error.stackTraceLimit = 100

const t = require('../../testutil.js')

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 2)
    const request4 = t.choose(game, request3, 'red')
    const request5 = t.choose(game, request4, 'auto')

    t.testIsFirstAction(request5)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Construction', 'Archery'],
          splay: 'right'
        },
        hand: ['Reformation', 'Experimentation', 'Enterprise', 'Perspective'],
        score: ['Oars', 'Gunpowder'],
      },
    })
  })

  describe("Mona Lisa: guess wrong", () => {

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

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'dogma')
      const request3 = t.choose(game, request2, 1)
      const request4 = t.choose(game, request3, 'red')
      const request5 = t.choose(game, request4, 'auto')

      t.testIsFirstAction(request5)
      t.testBoard(game, {
        dennis: {
          red: ['Construction', 'Archery'],
        },
      })
    })
  })
})
