Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Canal Building', () => {
  test('exchange cards', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Canal Building'],
        hand: ['Industrialization', 'Tools'],
        score: ['Chemistry', 'Steam Engine', 'Colonialism'],
      },
    })
    const result1 = game.run()
    const result2 = t.choose(game, 'Dogma.Canal Building')
    const result3 = t.choose(game, 'Exchange highest cards between hand and score pile')

    expect(t.cards(game, 'score').sort()).toEqual(['Colonialism', 'Industrialization'])
    expect(t.cards(game, 'hand').sort()).toEqual(['Chemistry', 'Steam Engine', 'Tools'])
  })

  test('junk deck', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Canal Building'],
        hand: ['Industrialization', 'Tools'],
        score: ['Chemistry', 'Steam Engine', 'Colonialism'],
      },
    })
    const result1 = game.run()
    const result2 = t.choose(game, 'Dogma.Canal Building')
    const result3 = t.choose(game, 'Junk all cards in the 3 deck')

    t.testDeckIsJunked(game, 3)
  })
})
