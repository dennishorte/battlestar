const t = require('../../../testutil_v2.js')

describe('Fodder Chamber', () => {
  test('scores 1 VP per 5 animals in 2-player game', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 10,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['fodder-chamber-d035'],
        stone: 3,
        grain: 3,
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }, { row: 2, col: 1 }], sheep: 4 },
            { spaces: [{ row: 2, col: 2 }, { row: 2, col: 3 }], boar: 3 },
            { spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }], cattle: 4 },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Fodder Chamber')

    const dennis = game.players.byName('dennis')
    const card = game.cards.byId('fodder-chamber-d035')
    // 2-player game: threshold = 5
    // Total animals: 4 + 3 + 4 = 11
    // floor(11 / 5) = 2 VP
    expect(card.definition.getEndGamePoints(dennis, game)).toBe(2)
  })
})
