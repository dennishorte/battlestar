const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Party Organizer (OccD 157)', () => {
  test('gives 8 food when another player gains 5th person for first time', () => {
    const card = res.getCardById('party-organizer-d157')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.food = 0
    micah.getFamilySize = () => 5
    card.triggered = false

    card.onAnyFamilyGrowth(game, micah, dennis)

    expect(dennis.food).toBe(8)
    expect(card.triggered).toBe(true)
  })

  test('does not trigger again after already triggered', () => {
    const card = res.getCardById('party-organizer-d157')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.food = 0
    micah.getFamilySize = () => 5
    card.triggered = true

    card.onAnyFamilyGrowth(game, micah, dennis)

    expect(dennis.food).toBe(0)
  })

  test('does not trigger when card owner gains 5th person', () => {
    const card = res.getCardById('party-organizer-d157')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.getFamilySize = () => 5
    card.triggered = false

    card.onAnyFamilyGrowth(game, dennis, dennis)

    expect(dennis.food).toBe(0)
    expect(card.triggered).toBeFalsy()
  })

  test('does not trigger when another player gains less than 5th person', () => {
    const card = res.getCardById('party-organizer-d157')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.food = 0
    micah.getFamilySize = () => 4
    card.triggered = false

    card.onAnyFamilyGrowth(game, micah, dennis)

    expect(dennis.food).toBe(0)
  })

  test('gives 3 bonus points if only card owner has 5 people', () => {
    const card = res.getCardById('party-organizer-d157')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.getFamilySize = () => 5
    micah.getFamilySize = () => 4

    const points = card.getEndGamePoints(dennis, game)

    expect(points).toBe(3)
  })

  test('gives 0 bonus points if another player also has 5 people', () => {
    const card = res.getCardById('party-organizer-d157')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.getFamilySize = () => 5
    micah.getFamilySize = () => 5

    const points = card.getEndGamePoints(dennis, game)

    expect(points).toBe(0)
  })

  test('gives 0 bonus points if card owner has less than 5 people', () => {
    const card = res.getCardById('party-organizer-d157')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.getFamilySize = () => 4

    const points = card.getEndGamePoints(dennis, game)

    expect(points).toBe(0)
  })
})
