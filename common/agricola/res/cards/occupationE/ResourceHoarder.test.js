const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Resource Hoarder (E123)', () => {
  test('initializes pile on play', () => {
    const card = res.getCardById('resource-hoarder-e123')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(card.pile).toEqual(['stone', 'clay', 'stone', 'reed', 'wood', 'clay'])
  })

  test('can use top resource when it matches', () => {
    const card = res.getCardById('resource-hoarder-e123')

    card.pile = ['stone', 'clay', 'wood']

    expect(card.canUseTopResource('wood')).toBe(true)
  })

  test('cannot use top resource when it does not match', () => {
    const card = res.getCardById('resource-hoarder-e123')

    card.pile = ['stone', 'clay', 'wood']

    expect(card.canUseTopResource('stone')).toBe(false)
  })

  test('cannot use top resource when pile is empty', () => {
    const card = res.getCardById('resource-hoarder-e123')

    card.pile = []

    expect(card.canUseTopResource('wood')).toBe(false)
  })

  test('useTopResource removes and returns top resource', () => {
    const card = res.getCardById('resource-hoarder-e123')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    card.pile = ['stone', 'clay', 'wood']

    const dennis = t.player(game)

    const resource = card.useTopResource(game, dennis)

    expect(resource).toBe('wood')
    expect(card.pile).toEqual(['stone', 'clay'])
  })

  test('useTopResource returns null when pile is empty', () => {
    const card = res.getCardById('resource-hoarder-e123')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    card.pile = []

    const dennis = t.player(game)

    const resource = card.useTopResource(game, dennis)

    expect(resource).toBeNull()
  })
})
