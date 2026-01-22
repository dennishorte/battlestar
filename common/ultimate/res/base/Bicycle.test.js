Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Bicycle', () => {
  test('yes', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        green: ['Bicycle'],
        hand: ['Industrialization', 'Tools'],
        score: ['Chemistry'],
      },
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Bicycle')
    const result3 = t.choose(game, result2, 'yes')

    expect(t.cards(game, 'hand')).toEqual(['Chemistry'])
    expect(t.cards(game, 'score').sort()).toEqual(['Industrialization', 'Tools'])
  })

  test('no', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        green: ['Bicycle'],
        hand: ['Industrialization', 'Tools'],
        score: ['Chemistry'],
      },
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Bicycle')
    const result3 = t.choose(game, result2, 'no')

    expect(t.cards(game, 'score')).toEqual(['Chemistry'])
    expect(t.cards(game, 'hand').sort()).toEqual(['Industrialization', 'Tools'])
  })
})
