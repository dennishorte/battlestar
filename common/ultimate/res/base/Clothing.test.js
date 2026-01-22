Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Clothing', () => {
  test('transfer a card', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        green: ['Clothing'],
        blue: ['Tools'],
        hand: ['Mathematics', 'Code of Laws'],
      },
      micah: {
        purple: ['Mysticism'],
      },
      decks: {
        base: {
          1: ['Writing', 'Archery'],
        },
      },
    })
    const result1 = game.run()
    const result2 = t.choose(game, 'Dogma.Clothing')

    expect(t.cards(game, 'purple')).toEqual(['Code of Laws'])
    expect(t.cards(game, 'score').sort()).toEqual(['Archery', 'Writing'])
  })

})
