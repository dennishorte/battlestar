const t = require('../../../testutil_v2.js')

describe('Full Farmer', () => {
  test('onPlay gives 1 wood and 1 clay', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Lessons A'],
      dennis: {
        hand: ['full-farmer-a134'],
        occupations: [],
        wood: 0,
        clay: 0,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Full Farmer')

    t.testBoard(game, {
      dennis: {
        occupations: ['full-farmer-a134'],
        wood: 1,
        clay: 1,
      },
    })
  })

  test('getEndGamePoints: 0 VP with no full pastures', () => {
    const game = t.fixture({ cardSets: ['occupationA'], numPlayers: 3 })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['full-farmer-a134'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }], sheep: 1 },
          ],
        },
      },
    })
    game.run()

    const dennis = t.dennis(game)
    const scoreWithout = dennis.calculateScore()
    t.setPlayerCards(game, dennis, 'occupations', [])
    const scoreWithoutCard = dennis.calculateScore()
    expect(scoreWithout - scoreWithoutCard).toBe(0)
  })

  test('getEndGamePoints: +1 VP per full pasture', () => {
    const game = t.fixture({ cardSets: ['occupationA'], numPlayers: 3 })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['full-farmer-a134'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }], sheep: 2 },
          ],
        },
      },
    })
    game.run()

    const dennis = t.dennis(game)
    const scoreWith = dennis.calculateScore()
    t.setPlayerCards(game, dennis, 'occupations', [])
    const scoreWithout = dennis.calculateScore()
    expect(scoreWith - scoreWithout).toBe(1)
  })

  test('getEndGamePoints: +2 VP for two full pastures', () => {
    const game = t.fixture({ cardSets: ['occupationA'], numPlayers: 3 })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['full-farmer-a134'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }], sheep: 2 },
            { spaces: [{ row: 2, col: 1 }], boar: 2 },
          ],
        },
      },
    })
    game.run()

    const dennis = t.dennis(game)
    const scoreWith = dennis.calculateScore()
    t.setPlayerCards(game, dennis, 'occupations', [])
    const scoreWithout = dennis.calculateScore()
    expect(scoreWith - scoreWithout).toBe(2)
  })
})
