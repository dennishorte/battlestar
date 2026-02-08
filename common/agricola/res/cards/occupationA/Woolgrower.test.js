const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Woolgrower (OccA 148)', () => {
  test('holds sheep', () => {
    const card = res.getCardById('woolgrower-a148')

    expect(card.holdsAnimals).toEqual({ sheep: true })
  })

  test('capacity equals completed feeding phases', () => {
    const card = res.getCardById('woolgrower-a148')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    game.getCompletedFeedingPhases = () => 3

    expect(card.getAnimalCapacity(game)).toBe(3)
  })

  test('capacity is 0 with no feeding phases completed', () => {
    const card = res.getCardById('woolgrower-a148')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    game.getCompletedFeedingPhases = () => 0

    expect(card.getAnimalCapacity(game)).toBe(0)
  })

  test('capacity increases with more feeding phases', () => {
    const card = res.getCardById('woolgrower-a148')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    game.getCompletedFeedingPhases = () => 5

    expect(card.getAnimalCapacity(game)).toBe(5)
  })
})
