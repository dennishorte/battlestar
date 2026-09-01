const { formatCardCost, getCardCostSegments } = require('./cardCost.js')

describe('formatCardCost', () => {
  test('Chicken Coop shows wood-or-clay plus shared reed', () => {
    const card = {
      cost: { wood: 2, reed: 1 },
      costAlternative: { clay: 2, reed: 1 },
    }
    expect(formatCardCost(card, { icons: true, style: 'compact' })).toBe('2🪵/2🧱 1🌿')
    expect(formatCardCost(card, { style: 'verbose' })).toBe('(2 wood or 2 clay) and 1 reed')
  })

  test('Barley Mill keeps shared wood and offers clay or stone', () => {
    const card = {
      cost: { wood: 1, clay: 4 },
      costAlternative: { wood: 1, stone: 2 },
    }
    expect(formatCardCost(card, { icons: true, style: 'compact' })).toBe('1🪵 4🧱/2🪨')
    expect(formatCardCost(card, { style: 'verbose' })).toBe('1 wood and (4 clay or 2 stone)')
  })

  test('Grain Depot lists three exclusive building-resource costs', () => {
    const card = {
      cost: { wood: 2 },
      costAlternative: { clay: 2 },
      costAlternative2: { stone: 2 },
    }
    expect(formatCardCost(card, { icons: true, style: 'compact' })).toBe('2🪵/2🧱/2🪨')
    expect(formatCardCost(card, { style: 'verbose' })).toBe('2 wood or 2 clay or 2 stone')
  })

  test('single cost is unchanged', () => {
    const card = { cost: { wood: 2, reed: 1 } }
    expect(formatCardCost(card, { icons: true, style: 'compact' })).toBe('2🪵 1🌿')
    expect(formatCardCost(card, { style: 'verbose' })).toBe('2 wood and 1 reed')
  })

  test('returns empty string when there is no resource cost', () => {
    expect(formatCardCost({})).toBe('')
    expect(formatCardCost({ cost: {} })).toBe('')
    expect(formatCardCost(null)).toBe('')
  })

  test('skips special alternative keys such as cookBoar', () => {
    const card = {
      cost: { boar: 1 },
      costAlternative: { cookBoar: true },
    }
    expect(formatCardCost(card, { icons: true, style: 'compact' })).toBe('1🐗')
  })
})

describe('getCardCostSegments', () => {
  test('places the alternative group before shared reed', () => {
    const segments = getCardCostSegments({
      cost: { wood: 2, reed: 1 },
      costAlternative: { clay: 2, reed: 1 },
    })
    expect(segments).toEqual([
      {
        kind: 'alternatives',
        options: [
          [{ resource: 'wood', amount: 2 }],
          [{ resource: 'clay', amount: 2 }],
        ],
      },
      { kind: 'resource', resource: 'reed', amount: 1 },
    ])
  })
})
