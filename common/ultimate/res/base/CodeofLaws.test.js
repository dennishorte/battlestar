Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Code of Laws', () => {
  test('dogma, with splay', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: ['Code of Laws'],
        blue: ['Tools'],
        green: ['The Wheel'],
        red: ['Archery'],
        hand: ['Writing', 'Agriculture', 'Metalworking'],
      }
    })

    game.run()
    const result2 = t.choose(game, 'Dogma.Code of Laws')

    expect(result2.selectors[0].choices.sort()).toEqual(['Metalworking', 'Writing'])

    const result3 = t.choose(game, 'Writing')

    expect(result3.selectors[0].choices.sort()).toEqual(['blue'])

    t.choose(game, 'blue')

    t.testBoard(game, {
      dennis: {
        purple: ['Code of Laws'],
        blue: {
          cards: ['Tools', 'Writing'],
          splay: 'left',
        },
        green: ['The Wheel'],
        red: ['Archery'],
        hand: ['Agriculture', 'Metalworking'],
      },
    })
  })

})
