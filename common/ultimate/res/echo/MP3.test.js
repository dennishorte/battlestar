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
          10: ['Social Networking', 'Cell Phone']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.MP3')
    request = t.choose(game, request, 'Sailing', 'Tools')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, '**base-1*')
    request = t.choose(game, request, '**base-1*')
    request = t.choose(game, request, '**base-2*')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['MP3'],
        hand: ['Domestication'],
        score: ['Lighting', 'Social Networking', 'Cell Phone'],
        achievements: ['Construction', 'The Wheel', 'Mysticism', 'Engineering', 'Fermenting'],
      },
    })
  })
})
