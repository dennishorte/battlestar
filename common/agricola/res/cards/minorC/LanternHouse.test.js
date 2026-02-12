const t = require('../../../testutil_v2.js')

describe('Lantern House', () => {
  test('has 7 static VP and penalizes cards in hand', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['lantern-house-c035'],
        wood: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Lantern House')

    const dennis = game.players.byName('dennis')
    const card = game.cards.byId('lantern-house-c035')
    // vps: 7, but penalty for cards still in hand
    const handSize = dennis.hand.length
    expect(card.definition.getEndGamePoints(dennis)).toBe(-handSize)
  })
})
