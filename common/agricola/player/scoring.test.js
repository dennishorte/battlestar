const t = require('../testutil.js')
const res = require('../res/index.js')

describe('scoring', () => {
  test('field scoring', () => {
    const game = t.fixture()
    game.run()

    // 0-1 fields = -1 point
    expect(res.scoreCategory('fields', 0)).toBe(-1)
    expect(res.scoreCategory('fields', 1)).toBe(-1)

    // 2 fields = 1 point
    expect(res.scoreCategory('fields', 2)).toBe(1)

    // 5+ fields = 4 points
    expect(res.scoreCategory('fields', 5)).toBe(4)
  })

  test('pasture scoring', () => {
    // 0 pastures = -1
    expect(res.scoreCategory('pastures', 0)).toBe(-1)

    // 4+ pastures = 4 points
    expect(res.scoreCategory('pastures', 4)).toBe(4)
  })

  test('grain scoring', () => {
    // 0 grain = -1
    expect(res.scoreCategory('grain', 0)).toBe(-1)

    // 1-3 grain = 1 point
    expect(res.scoreCategory('grain', 1)).toBe(1)
    expect(res.scoreCategory('grain', 3)).toBe(1)

    // 8+ grain = 4 points
    expect(res.scoreCategory('grain', 8)).toBe(4)
  })

  test('animal scoring', () => {
    // Sheep: 8+ = 4 points
    expect(res.scoreCategory('sheep', 8)).toBe(4)

    // Boar: 7+ = 4 points
    expect(res.scoreCategory('boar', 7)).toBe(4)

    // Cattle: 6+ = 4 points
    expect(res.scoreCategory('cattle', 6)).toBe(4)
  })

  test('room scoring', () => {
    expect(res.scoreRooms(3, 'wood')).toBe(0)
    expect(res.scoreRooms(3, 'clay')).toBe(3)
    expect(res.scoreRooms(3, 'stone')).toBe(6)
  })

  test('family member scoring', () => {
    expect(res.scoreFamilyMembers(2)).toBe(6)
    expect(res.scoreFamilyMembers(5)).toBe(15)
  })

  test('unused space penalty', () => {
    expect(res.scoreUnusedSpaces(5)).toBe(-5)
  })

  test('begging card penalty', () => {
    expect(res.scoreBeggingCards(2)).toBe(-6)
  })

  test('complete score calculation', () => {
    const game = t.gameFixture({
      dennis: {
        familyMembers: 3,
        grain: 4,
        vegetables: 2,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    t.plowFields(dennis, [{ row: 1, col: 0 }, { row: 1, col: 1 }])
    t.addPasture(dennis, [{ row: 2, col: 0 }], 'sheep', 4)

    const breakdown = dennis.getScoreBreakdown()

    expect(breakdown.fields.count).toBe(2)
    expect(breakdown.fields.points).toBe(1)
    expect(breakdown.pastures.count).toBe(1)
    expect(breakdown.pastures.points).toBe(1)
    expect(breakdown.grain.count).toBe(4)
    expect(breakdown.grain.points).toBe(2)
    expect(breakdown.vegetables.count).toBe(2)
    expect(breakdown.vegetables.points).toBe(2)
    expect(breakdown.sheep.count).toBe(4)
    expect(breakdown.sheep.points).toBe(2)
    expect(breakdown.familyMembers.count).toBe(3)
    expect(breakdown.familyMembers.points).toBe(9)
  })
})
