const t = require('../../../testutil_v2.js')

describe('Misanthropy', () => {
  test('scores 5 VP for exactly 2 people', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 10,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['misanthropy-e035'],
        wood: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Misanthropy')

    const dennis = game.players.byName('dennis')
    const card = game.cards.byId('misanthropy-e035')
    // Default 2 family members → 5 VP
    expect(card.definition.getEndGamePoints(dennis)).toBe(5)
  })

  test('scores 3 VP for exactly 3 people', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 10,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['misanthropy-e035'],
        wood: 1,
        familyMembers: 3,
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Misanthropy')

    const dennis = game.players.byName('dennis')
    const card = game.cards.byId('misanthropy-e035')
    expect(card.definition.getEndGamePoints(dennis)).toBe(3)
  })

  test('scores 0 VP for 5 people', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 10,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['misanthropy-e035'],
        wood: 1,
        familyMembers: 5,
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 },
            { row: 0, col: 1 }, { row: 1, col: 1 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Misanthropy')

    const dennis = game.players.byName('dennis')
    const card = game.cards.byId('misanthropy-e035')
    expect(card.definition.getEndGamePoints(dennis)).toBe(0)
  })
})
