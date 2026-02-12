const t = require('../../../testutil_v2.js')

describe('Ox Skull', () => {
  test('gives 1 food on play', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['ox-skull-e037'],
        pet: 'cattle',
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Ox Skull')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 2, // 1 from Ox Skull + 1 from Meeting Place
        pet: 'cattle',
        animals: { cattle: 1 },
        minorImprovements: ['ox-skull-e037'],
      },
    })
  })

  test('gives 3 bonus points at end if no cattle', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        // Play from hand to satisfy prereq (need cattle at time of play)
        hand: ['ox-skull-e037'],
        pet: 'cattle',
      },
    })
    game.run()

    // Play the card
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Ox Skull')

    // Now remove the cattle manually to test scoring
    const dennis = game.players.byName('dennis')
    dennis.pet = null

    expect(dennis.getTotalAnimals('cattle')).toBe(0)
    const card = game.cards.byId('ox-skull-e037')
    expect(card.definition.getEndGamePoints(dennis)).toBe(3)
  })

  test('gives 0 bonus points at end if player has cattle', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['ox-skull-e037'],
        pet: 'cattle',
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Ox Skull')

    const dennis = game.players.byName('dennis')
    const card = game.cards.byId('ox-skull-e037')
    expect(card.definition.getEndGamePoints(dennis)).toBe(0)
  })
})
