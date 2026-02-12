const t = require('../../../testutil_v2.js')

describe('Artisan District', () => {
  test('scores 2 VP for 3 bottom-row majors', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 10,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['artisan-district-d030'],
        stone: 1,
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        majorImprovements: ['clay-oven', 'stone-oven', 'joinery'],
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Artisan District')

    const dennis = game.players.byName('dennis')
    const card = game.cards.byId('artisan-district-d030')
    expect(card.definition.getEndGamePoints(dennis)).toBe(2)
  })

  test('scores 0 VP for fewer than 3 bottom-row majors', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 10,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['artisan-district-d030'],
        stone: 1,
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        majorImprovements: ['clay-oven', 'stone-oven'],
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Artisan District')

    const dennis = game.players.byName('dennis')
    const card = game.cards.byId('artisan-district-d030')
    expect(card.definition.getEndGamePoints(dennis)).toBe(0)
  })
})
