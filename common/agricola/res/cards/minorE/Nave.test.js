const t = require('../../../testutil_v2.js')

describe('Nave', () => {
  test('scores 1 VP per column with rooms', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 10,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['nave-e032'],
        stone: 2,
        reed: 1,
        farmyard: {
          rooms: [
            { row: 0, col: 0 },
            { row: 1, col: 0 },
            { row: 0, col: 1 },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Nave')

    const dennis = game.players.byName('dennis')
    const card = game.cards.byId('nave-e032')
    // Rooms in columns 0 and 1 → 2 VP
    expect(card.definition.getEndGamePoints(dennis)).toBe(2)
  })
})
