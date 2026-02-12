const t = require('../../../testutil_v2.js')

describe('Half-Timbered House', () => {
  test('scores VP equal to stone room count', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['half-timbered-house-c030'],
        wood: 1,
        clay: 1,
        stone: 2,
        reed: 1,
        roomType: 'stone',
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Half-Timbered House')

    const dennis = game.players.byName('dennis')
    const card = game.cards.byId('half-timbered-house-c030')
    expect(card.definition.getEndGamePoints(dennis)).toBe(3)
  })

  test('scores 0 if not stone house', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['half-timbered-house-c030'],
        wood: 1,
        clay: 1,
        stone: 2,
        reed: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Half-Timbered House')

    const dennis = game.players.byName('dennis')
    const card = game.cards.byId('half-timbered-house-c030')
    expect(card.definition.getEndGamePoints(dennis)).toBe(0)
  })
})
