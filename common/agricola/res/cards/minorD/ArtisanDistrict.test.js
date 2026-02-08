const res = require('../../index.js')

describe('Artisan District (D030)', () => {
  test('gives 0 points for fewer than 3 bottom row majors', () => {
    const card = res.getCardById('artisan-district-d030')
    const player = { majorImprovements: ['clay-oven', 'stone-oven'] }
    expect(card.getEndGamePoints(player)).toBe(0)
  })

  test('gives 2 points for 3 bottom row majors', () => {
    const card = res.getCardById('artisan-district-d030')
    const player = { majorImprovements: ['clay-oven', 'stone-oven', 'joinery'] }
    expect(card.getEndGamePoints(player)).toBe(2)
  })

  test('gives 5 points for 4 bottom row majors', () => {
    const card = res.getCardById('artisan-district-d030')
    const player = { majorImprovements: ['clay-oven', 'stone-oven', 'joinery', 'pottery'] }
    expect(card.getEndGamePoints(player)).toBe(5)
  })

  test('gives 8 points for 5 bottom row majors', () => {
    const card = res.getCardById('artisan-district-d030')
    const player = { majorImprovements: ['clay-oven', 'stone-oven', 'joinery', 'pottery', 'basketmakers-workshop'] }
    expect(card.getEndGamePoints(player)).toBe(8)
  })

  test('ignores non-bottom row majors', () => {
    const card = res.getCardById('artisan-district-d030')
    const player = { majorImprovements: ['clay-oven', 'stone-oven', 'well', 'cooking-hearth'] }
    expect(card.getEndGamePoints(player)).toBe(0)
  })

  test('has correct properties', () => {
    const card = res.getCardById('artisan-district-d030')
    expect(card.cost).toEqual({ stone: 1 })
    expect(card.vps).toBe(1)
    expect(card.prereqs).toEqual({ occupations: 3 })
  })
})
