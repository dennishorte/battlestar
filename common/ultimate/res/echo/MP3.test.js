Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("MP3", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['MP3'],
        hand: ['Sailing', 'Tools', 'Domestication'],
        score: ['Lighting'],
        achievements: ['Construction'],
      },
      achievements: ['The Wheel', 'Mysticism', 'Fermenting', 'Engineering'],
      decks: {
        echo: {
          10: ['Social Network']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.MP3')
    const request3 = t.choose(game, request2, 'Sailing', 'Tools')
    const request4 = t.choose(game, request3, 'auto')
    const request5 = t.choose(game, request4, 'age 1')
    const request6 = t.choose(game, request5, 'age 1')

    t.testIsSecondPlayer(request6)
    t.testBoard(game, {
      dennis: {
        yellow: ['MP3'],
        hand: ['Domestication'],
        score: ['Lighting', 'Social Network'],
        achievements: ['Construction', 'The Wheel', 'Mysticism', 'Engineering'],
      },
    })
  })
})
