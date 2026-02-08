const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Pig Owner (OccA 153)', () => {
  test('gives 3 bonus points when reaching 5 boar for the first time', () => {
    const card = res.getCardById('pig-owner-a153')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.bonusPoints = 0
    dennis.getTotalAnimals = () => 5

    card.checkTrigger(game, dennis)

    expect(dennis.pigOwnerTriggered).toBe(true)
    expect(dennis.bonusPoints).toBe(3)
  })

  test('does not trigger a second time', () => {
    const card = res.getCardById('pig-owner-a153')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.bonusPoints = 3
    dennis.pigOwnerTriggered = true
    dennis.getTotalAnimals = () => 6

    card.checkTrigger(game, dennis)

    expect(dennis.bonusPoints).toBe(3)
  })

  test('does not trigger with fewer than 5 boar', () => {
    const card = res.getCardById('pig-owner-a153')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.bonusPoints = 0
    dennis.getTotalAnimals = () => 4

    card.checkTrigger(game, dennis)

    expect(dennis.pigOwnerTriggered).toBeUndefined()
    expect(dennis.bonusPoints).toBe(0)
  })
})
