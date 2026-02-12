const t = require('../../../testutil_v2.js')

describe('Breed Registry', () => {
  test('sets up tracking on play and scores 3 VP by default', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['breed-registry-d036'],
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Breed Registry')

    const dennis = game.players.byName('dennis')
    expect(dennis.breedRegistryActive).toBe(true)
    expect(dennis.sheepGainedNonBreeding).toBe(0)
    expect(dennis.sheepTurnedToFood).toBe(0)

    const card = game.cards.byId('breed-registry-d036')
    expect(card.definition.getEndGamePoints(dennis)).toBe(3)
  })

  test('scores 0 VP if too many sheep gained', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['breed-registry-d036'],
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Breed Registry')

    const dennis = game.players.byName('dennis')
    dennis.sheepGainedNonBreeding = 3

    const card = game.cards.byId('breed-registry-d036')
    expect(card.definition.getEndGamePoints(dennis)).toBe(0)
  })
})
