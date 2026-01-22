const t = require('../../testutil.js')

describe('Mapmaking', () => {
  test('demand', () => {
    const game = t.fixtureFirstPlayer({ numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        green: ['Mapmaking'],
      },
      micah: {
        score: ['The Wheel', 'Mathematics'],
      },
      scott: {
        score: ['Navigation'],
      },
      decks: {
        base: {
          1: ['Mysticism'],
        },
      },
    })
    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Mapmaking')

    expect(t.cards(game, 'score').sort()).toEqual(['Mysticism', 'The Wheel'])
  })

  test('if a card was not transferred', () => {
    const game = t.fixtureFirstPlayer({ numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        green: ['Mapmaking'],
      },
      micah: {
        score: ['Mathematics'],
      },
      scott: {
        score: ['Navigation'],
      },
    })
    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Mapmaking')

    expect(t.cards(game, 'score').sort()).toEqual([])
  })
})
