const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Domestician Expert (OccD 148)', () => {
  test('holds sheep', () => {
    const card = res.getCardById('domestician-expert-d148')
    expect(card.holdsAnimals).toEqual({ sheep: true })
  })

  test('provides animal capacity based on adjacent room pairs', () => {
    const card = res.getCardById('domestician-expert-d148')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.getAdjacentRoomPairCount = () => 3

    const capacity = card.getAnimalCapacity(dennis)

    expect(capacity).toBe(6) // 3 pairs * 2 sheep each
  })

  test('provides 0 capacity with no adjacent rooms', () => {
    const card = res.getCardById('domestician-expert-d148')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.getAdjacentRoomPairCount = () => 0

    const capacity = card.getAnimalCapacity(dennis)

    expect(capacity).toBe(0)
  })

  test('provides 2 capacity with 1 adjacent room pair', () => {
    const card = res.getCardById('domestician-expert-d148')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.getAdjacentRoomPairCount = () => 1

    const capacity = card.getAnimalCapacity(dennis)

    expect(capacity).toBe(2)
  })
})
