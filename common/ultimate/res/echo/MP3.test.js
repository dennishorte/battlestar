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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.MP3')
    request = t.choose(game, request, 'Sailing', 'Tools')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'age 1')
    request = t.choose(game, request, 'age 1')

    t.testIsSecondPlayer(game)
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
