const res = require('../../index.js')

describe('Sheep Walker (B104)', () => {
  test('has allowsAnytimeExchange flag', () => {
    const card = res.getCardById('sheep-walker-b104')
    expect(card.allowsAnytimeExchange).toBe(true)
  })

  test('has exchange options for sheep to boar', () => {
    const card = res.getCardById('sheep-walker-b104')
    const boarOption = card.exchangeOptions.find(
      opt => opt.from.sheep === 1 && opt.to.boar === 1
    )
    expect(boarOption).toBeDefined()
  })

  test('has exchange options for sheep to vegetables', () => {
    const card = res.getCardById('sheep-walker-b104')
    const vegOption = card.exchangeOptions.find(
      opt => opt.from.sheep === 1 && opt.to.vegetables === 1
    )
    expect(vegOption).toBeDefined()
  })

  test('has exchange options for sheep to stone', () => {
    const card = res.getCardById('sheep-walker-b104')
    const stoneOption = card.exchangeOptions.find(
      opt => opt.from.sheep === 1 && opt.to.stone === 1
    )
    expect(stoneOption).toBeDefined()
  })
})
