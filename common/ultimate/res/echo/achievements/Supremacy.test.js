Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe('Supremacy Achievement', () => {
  test('achieved', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game, {
      dennis: {
        green: ['The Wheel'],
        yellow: ['Masonry'],
        red: ['Metalworking'],
        hand: ['Mysticism'],
      },
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Mysticism')

    expect(t.cards(game, 'achievements')).toStrictEqual(['Supremacy'])
  })
})
