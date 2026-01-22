Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe('Universe Achievement', () => {
  test('achieved', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Flight'],
        yellow: ['Skyscrapers'],
        green: ['Corporations'],
        blue: ['Rocketry'],
        hand: ['Empiricism'],
      },
    })
    let request
    request = game.run()
    request = t.choose(game, 'Meld.Empiricism')

    expect(t.cards(game, 'achievements')).toEqual(['Universe'])
  })
})
