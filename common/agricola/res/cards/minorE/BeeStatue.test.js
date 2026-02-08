const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Bee Statue (E040)', () => {
  test('initializes stack on play', () => {
    const card = res.getCardById('bee-statue-e040')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(card.stack).toEqual(['vegetables', 'stone', 'grain', 'stone', 'grain'])
  })

  test('gives top resource on day-laborer action', () => {
    const card = res.getCardById('bee-statue-e040')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    card.stack = ['vegetables', 'stone', 'grain', 'stone', 'grain']

    card.onAction(game, dennis, 'day-laborer')

    expect(dennis.grain).toBe(1)
    expect(card.stack).toEqual(['vegetables', 'stone', 'grain', 'stone'])
  })

  test('does not give resource on other actions', () => {
    const card = res.getCardById('bee-statue-e040')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    card.stack = ['vegetables', 'stone', 'grain', 'stone', 'grain']

    card.onAction(game, dennis, 'forest')

    expect(dennis.grain).toBe(0)
    expect(card.stack.length).toBe(5)
  })

  test('does not give resource when stack is empty', () => {
    const card = res.getCardById('bee-statue-e040')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    card.stack = []

    card.onAction(game, dennis, 'day-laborer')

    expect(dennis.grain).toBe(0)
  })
})
