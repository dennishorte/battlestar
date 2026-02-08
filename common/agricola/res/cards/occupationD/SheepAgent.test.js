const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Sheep Agent (OccD 086)', () => {
  test('holds sheep', () => {
    const card = res.getCardById('sheep-agent-d086')
    expect(card.holdsAnimals).toEqual({ sheep: true })
  })

  test('provides animal capacity based on occupation count', () => {
    const card = res.getCardById('sheep-agent-d086')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.getPlayedOccupations = () => [
      { id: 'sheep-agent-d086', holdsAnimals: { sheep: true } },
      { id: 'occupation-2' },
      { id: 'occupation-3' },
    ]

    const capacity = card.getAnimalCapacity(dennis)

    expect(capacity).toBe(3)
  })

  test('excludes other occupations that already hold animals', () => {
    const card = res.getCardById('sheep-agent-d086')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.getPlayedOccupations = () => [
      { id: 'sheep-agent-d086', holdsAnimals: { sheep: true } },
      { id: 'other-animal-holder', holdsAnimals: { boar: true } },
      { id: 'occupation-3' },
    ]

    const capacity = card.getAnimalCapacity(dennis)

    expect(capacity).toBe(2) // This card + occupation-3
  })

  test('provides 0 capacity when only card is played', () => {
    const card = res.getCardById('sheep-agent-d086')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.getPlayedOccupations = () => [
      { id: 'sheep-agent-d086', holdsAnimals: { sheep: true } },
    ]

    const capacity = card.getAnimalCapacity(dennis)

    expect(capacity).toBe(1)
  })
})
