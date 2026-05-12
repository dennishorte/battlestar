const { BaseCardManager } = require('./BaseCardManager.js')

describe('BaseCardManager.filterDefinitions', () => {
  const defs = [
    { id: 'a', source: 'Base' },
    { id: 'b', source: 'Expansion1', tags: ['promo'] },
    { id: 'c', source: 'Expansion2', tags: ['legacy', 'promo'] },
    { id: 'd', source: 'Base', tags: ['legacy'] },
  ]

  test('filters by sources allowlist', () => {
    expect(BaseCardManager.filterDefinitions(defs, { sources: ['Base'] }).map(d => d.id))
      .toEqual(['a', 'd'])
    expect(BaseCardManager.filterDefinitions(defs, { sources: ['Base', 'Expansion2'] }).map(d => d.id))
      .toEqual(['a', 'c', 'd'])
  })

  test('filters by tags (any match)', () => {
    expect(BaseCardManager.filterDefinitions(defs, { tags: ['promo'] }).map(d => d.id))
      .toEqual(['b', 'c'])
    expect(BaseCardManager.filterDefinitions(defs, { tags: ['legacy'] }).map(d => d.id))
      .toEqual(['c', 'd'])
  })

  test('combines sources and tags as AND', () => {
    expect(BaseCardManager.filterDefinitions(defs, { sources: ['Base'], tags: ['legacy'] }).map(d => d.id))
      .toEqual(['d'])
  })

  test('returns input unchanged when no filters provided', () => {
    expect(BaseCardManager.filterDefinitions(defs).map(d => d.id))
      .toEqual(['a', 'b', 'c', 'd'])
  })
})
