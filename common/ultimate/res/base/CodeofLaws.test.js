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

    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Code of Laws')

    expect(result2.selectors[0].choices.sort()).toEqual(['Metalworking', 'Writing'])

    const result3 = t.choose(game, result2, 'Writing')

    expect(result3.selectors[0].choices.sort()).toEqual(['blue'])

    const result4 = t.choose(game, result3, 'blue')

    expect(t.cards(game, 'blue')).toEqual(['Tools', 'Writing'])
    expect(t.zone(game, 'blue').splay).toBe('left')
  })

})
