describe('Blueprint', () => {
  test('allowsMajorsOnMinorAction lists correct major improvement IDs', () => {
    const card = require('./Blueprint.js')
    expect(card.allowsMajorsOnMinorAction).toEqual(['joinery', 'pottery', 'basketmakers-workshop'])
  })

  test('reduces stone cost by 1 for joinery', () => {
    const card = require('./Blueprint.js')
    const result = card.modifyMajorCost('joinery', { wood: 2, stone: 2 })
    expect(result).toEqual({ wood: 2, stone: 1 })
  })

  test('reduces stone cost by 1 for pottery', () => {
    const card = require('./Blueprint.js')
    const result = card.modifyMajorCost('pottery', { clay: 2, stone: 2 })
    expect(result).toEqual({ clay: 2, stone: 1 })
  })

  test('reduces stone cost by 1 for basketmakers workshop', () => {
    const card = require('./Blueprint.js')
    const result = card.modifyMajorCost('basketmakers-workshop', { reed: 2, stone: 2 })
    expect(result).toEqual({ reed: 2, stone: 1 })
  })

  test('does not reduce stone below 0', () => {
    const card = require('./Blueprint.js')
    const result = card.modifyMajorCost('joinery', { wood: 2 })
    expect(result).toEqual({ wood: 2 })
  })

  test('does not modify cost for other major improvements', () => {
    const card = require('./Blueprint.js')
    const result = card.modifyMajorCost('well', { wood: 1, stone: 3 })
    expect(result).toEqual({ wood: 1, stone: 3 })
  })
})
