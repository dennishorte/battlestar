const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Brook (B056)', () => {
  test('gives 1 food when using take-reed', () => {
    const card = res.getCardById('brook-b056')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.state.roundCardDeck = [{ id: 'some-round-card' }]

    card.onAction(game, dennis, 'take-reed')

    expect(dennis.food).toBe(1)
  })

  test('gives 1 food when using take-clay', () => {
    const card = res.getCardById('brook-b056')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.state.roundCardDeck = [{ id: 'some-round-card' }]

    card.onAction(game, dennis, 'take-clay')

    expect(dennis.food).toBe(1)
  })

  test('gives 1 food when using take-wood', () => {
    const card = res.getCardById('brook-b056')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.state.roundCardDeck = [{ id: 'some-round-card' }]

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.food).toBe(1)
  })

  test('gives 1 food when using round 1 card', () => {
    const card = res.getCardById('brook-b056')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.state.roundCardDeck = [{ id: 'round-1-action' }]

    card.onAction(game, dennis, 'round-1-action')

    expect(dennis.food).toBe(1)
  })

  test('does not give food for fishing action', () => {
    const card = res.getCardById('brook-b056')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.state.roundCardDeck = [{ id: 'some-round-card' }]

    card.onAction(game, dennis, 'fishing')

    expect(dennis.food).toBe(0)
  })

  test('requires person on fishing as prereq', () => {
    const card = res.getCardById('brook-b056')
    expect(card.prereqs.personOnFishing).toBe(true)
  })
})
